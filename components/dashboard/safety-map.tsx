/// <reference path="../../lib/leaflet-maps.ts" />

"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Loader2, AlertTriangle, MapIcon, LocateFixed, Route, Shield } from "lucide-react"
import { initMap, searchLocations, calculateRoute, reverseGeocode } from "../../lib/leaflet-maps"
import { type GeoFence, type UserLocation, createCircularGeofence } from "@/lib/geofencing"
import { useToast } from "@/components/ui/use-toast"
import { auth } from "@/lib/auth"
import type { ThreatLocation, RouteOptions } from "@/lib/types"
import { AddThreatLocationForm } from "@/components/safety/add-threat-location-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Helper function to calculate distance between two points in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

// Helper function to convert degrees to radians
const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
}

export function SafetyMap() {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [threatLocations, setThreatLocations] = useState<ThreatLocation[]>([])
  const [showAddThreatDialog, setShowAddThreatDialog] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [showRouteDialog, setShowRouteDialog] = useState(false)
  const [startLocation, setStartLocation] = useState<{ lat: number; lng: number; name: string } | null>(null)
  const [endLocation, setEndLocation] = useState<{ lat: number; lng: number; name: string } | null>(null)
  const [routeOptions, setRouteOptions] = useState<RouteOptions>({
    avoidThreatLocations: true,
    avoidHighways: false,
    avoidTolls: false,
    avoidFerries: false,
    preferSafeAreas: true,
  })
  const [activeTab, setActiveTab] = useState("map")
  const [locationSelectionMode, setLocationSelectionMode] = useState<"none" | "start" | "end">("none")
  const [showLocationContextMenu, setShowLocationContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [contextMenuLocation, setContextMenuLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Add state for location suggestions
  const [startLocationSuggestions, setStartLocationSuggestions] = useState<any[]>([]);
  const [endLocationSuggestions, setEndLocationSuggestions] = useState<any[]>([]);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout | null>(null);

  // Add state to track if a route is calculated
  const [routeCalculated, setRouteCalculated] = useState(false);

  // Add state for navigation options
  const [showNavOptions, setShowNavOptions] = useState(false);
  const [travelMode, setTravelMode] = useState<'walking' | 'driving' | 'transit' | 'bicycling'>('walking');
  const [avoidTraffic, setAvoidTraffic] = useState(true);
  const [considerGeofences, setConsiderGeofences] = useState(true);

  // Add state for traffic visualization
  const [showTrafficLayer, setShowTrafficLayer] = useState(false);
  const trafficLayerRef = useRef<any>(null);
  
  const mapRef = useRef<HTMLDivElement>(null)
  const tomtomMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const geofencesRef = useRef<GeoFence[]>([])
  const threatMarkersRef = useRef<any[]>([])
  const routeLayerRef = useRef<any>(null)
  const startMarkerRef = useRef<any>(null)
  const endMarkerRef = useRef<any>(null)

  const { toast } = useToast()

  // Get current position as a Promise
  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
      } else {
        navigator.geolocation.getCurrentPosition(
          resolve, 
          (error) => {
            // Provide more descriptive error messages based on error code
            switch (error.code) {
              case error.PERMISSION_DENIED:
                reject(new Error("Location permission denied. Please enable location services and refresh."));
                break;
              case error.POSITION_UNAVAILABLE:
                reject(new Error("Location information is unavailable. Please try again."));
                break;
              case error.TIMEOUT:
                reject(new Error("Location request timed out. Please try again."));
                break;
              default:
                reject(new Error(`Geolocation error: ${error.message || "Unknown error"}`));
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 10000, // Increase timeout to 10 seconds
            maximumAge: 0,
          }
        );
      }
    });
  };

  // Fix map initialization to ensure it's displayed properly
  useEffect(() => {
    // Create a key to track if component is mounted
    let isMounted = true;
    
    const initializeMap = async () => {
      if (!mapRef.current || !isMounted) return;
      
      try {
        setLoading(true);

        // Important: Only initialize if we don't already have a map
        if (tomtomMapRef.current) {
          console.log("Map already exists, reusing");
          // Just recenter the map if needed
          if (userLocation) {
            tomtomMapRef.current.setView([userLocation.latitude, userLocation.longitude], 13);
          }
          setLoading(false);
          return; // Exit early - don't reinitialize
        }

        console.log("Initializing new map instance");

        // Try to get user's current location
        let userPos: UserLocation | null = null;
        try {
          const position = await getCurrentPosition();
          userPos = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(),
            speed: position.coords.speed || undefined,
            heading: position.coords.heading || undefined,
          };
          if (userPos && isMounted) {
            setUserLocation(userPos);
            console.log("Using user's current location:", userPos);
          }
        } catch (locationError) {
          console.warn("Could not get user location:", locationError instanceof Error ? locationError.message : locationError);
          
          // Show a non-intrusive notification that we're using default location
          if (isMounted) {
            setTimeout(() => {
              toast({
                title: "Using default location",
                description: "Allow location access for a personalized experience",
                action: (
                  <Button variant="outline" size="sm" onClick={handleCurrentLocation}>
                    <LocateFixed className="h-4 w-4 mr-2" />
                    Get Location
                  </Button>
                ),
                duration: 7000,
              });
            }, 1500);
          }
        }

        // Check if component is still mounted
        if (!isMounted || !mapRef.current) return;

        // Initialize the map with user's location or default
        // Use default coordinates if userPos is null
        const defaultCoords = [77.580643, 12.972442]; // Bangalore
        const mapCenter = userPos ? [userPos.longitude, userPos.latitude] : defaultCoords;

        // Clear the map container first
        if (mapRef.current) {
          const mapElement = document.getElementById("safety-map");
          if (mapElement) {
            // Remove leaflet-related classes that might cause issues
            Array.from(mapElement.classList)
              .filter(cls => cls.startsWith('leaflet-'))
              .forEach(cls => mapElement.classList.remove(cls));
          }
        }

        // Initialize the map
        const map = await initMap("safety-map", {
          center: [mapCenter[1], mapCenter[0]],
          zoom: 13,
        });

        // Check again if component is still mounted
        if (!isMounted || !mapRef.current) {
          map.remove();
          return;
        }

        tomtomMapRef.current = map;

        // Add user marker if location is available
        if (userPos) {
          addUserMarker(map, userPos);
        }

        // Add sample geofences
        addSampleGeofences();

        // Render geofences on the map
        renderGeofences(map);

        // Load and render threat locations
        await loadThreatLocations();

        // Add click handler for the map
        map.on("click", handleMapClick);
        map.on("contextmenu", handleMapContextMenu);

        // Force a resize event to ensure proper rendering
        setTimeout(() => {
          if (isMounted && map && typeof map.invalidateSize === 'function') {
            map.invalidateSize();
          }
        }, 100);

        if (userPos && isMounted) {
          map.setView([userPos.latitude, userPos.longitude], 13);
        }

        if (loading && isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error initializing map:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Only run initialization if there's no existing map instance
    if (!tomtomMapRef.current) {
      initializeMap();
    } else {
      // If map already exists, just refresh it
      if (tomtomMapRef.current.invalidateSize) {
        console.log("Map already exists, refreshing size");
        tomtomMapRef.current.invalidateSize();
        setLoading(false);
      }
    }
    
    // Clean up function
    return () => {
      // Mark component as unmounted
      isMounted = false;
      
      // We'll keep the map instance but remove event listeners
      if (tomtomMapRef.current) {
        tomtomMapRef.current.off("click", handleMapClick);
        tomtomMapRef.current.off("contextmenu", handleMapContextMenu);
      }
      
      // Don't destroy the map here as it causes issues with React's
      // component lifecycle when navigating between tabs
    };
  }, []); // Empty dependency array to run only on mount

  // Handle map click
  const handleMapClick = (e: any) => {
    if (locationSelectionMode === "start") {
      setStartLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        name: "Selected Location",
      })
      addStartMarker(e.latlng.lat, e.latlng.lng)
      setLocationSelectionMode("none")

      toast({
        title: "Start location set",
        description: "Click 'Plan Route' to calculate a safe route",
      })
    } else if (locationSelectionMode === "end") {
      setEndLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        name: "Selected Location",
      })
      addEndMarker(e.latlng.lat, e.latlng.lng)
      setLocationSelectionMode("none")

      toast({
        title: "End location set",
        description: "Click 'Plan Route' to calculate a safe route",
      })
    }
  }

  // Handle map context menu (right click)
  const handleMapContextMenu = (e: any) => {
    e.originalEvent.preventDefault()

    setContextMenuPosition({
      x: e.originalEvent.clientX,
      y: e.originalEvent.clientY,
    })

    setContextMenuLocation({
      lat: e.latlng.lat,
      lng: e.latlng.lng,
    })

    setShowLocationContextMenu(true)
  }

  // Add start marker to the map
  const addStartMarker = (lat: number, lng: number) => {
    if (!tomtomMapRef.current) return

    // Remove existing start marker
    if (startMarkerRef.current) {
      startMarkerRef.current.remove()
    }

    // Create a custom marker element
    const markerElement = document.createElement("div")
    markerElement.className = "start-marker"
    markerElement.innerHTML = `
      <div class="w-8 h-8 bg-saheli-secondary rounded-full flex items-center justify-center animate-pulse shadow-lg">
        <div class="w-6 h-6 bg-saheli-primary rounded-full flex items-center justify-center">
          <div class="w-4 h-4 bg-white rounded-full flex items-center justify-center text-xs font-bold">A</div>
        </div>
      </div>
    `

    // Add marker to the map
    const icon = window.L.divIcon({
      html: markerElement.outerHTML,
      className: 'start-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })
    const marker = window.L.marker([lat, lng], {
      icon: icon
    }).addTo(tomtomMapRef.current)

    marker.bindPopup("Start Location")
    startMarkerRef.current = marker
  }

  // Add end marker to the map
  const addEndMarker = (lat: number, lng: number) => {
    if (!tomtomMapRef.current) return

    // Remove existing end marker
    if (endMarkerRef.current) {
      endMarkerRef.current.remove()
    }

    // Create a custom marker element
    const markerElement = document.createElement("div")
    markerElement.className = "end-marker"
    markerElement.innerHTML = `
      <div class="w-8 h-8 bg-saheli-accent rounded-full flex items-center justify-center animate-pulse shadow-lg">
        <div class="w-6 h-6 bg-saheli-orange rounded-full flex items-center justify-center">
          <div class="w-4 h-4 bg-white rounded-full flex items-center justify-center text-xs font-bold">B</div>
        </div>
      </div>
    `

    // Add marker to the map
    const icon = window.L.divIcon({
      html: markerElement.outerHTML,
      className: 'end-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })
    const marker = window.L.marker([lat, lng], {
      icon: icon
    }).addTo(tomtomMapRef.current)

    marker.bindPopup("End Location")
    endMarkerRef.current = marker
  }

  // Load threat locations from API
  const loadThreatLocations = async () => {
    try {
      const response = await fetch("/api/threat-locations")
      if (!response.ok) {
        throw new Error("Failed to load threat locations")
      }

      const locations = await response.json()
      setThreatLocations(locations)

      // Render threat locations on the map
      if (tomtomMapRef.current) {
        renderThreatLocations(tomtomMapRef.current, locations)
      }
    } catch (error) {
      console.error("Error loading threat locations:", error)
      toast({
        title: "Error",
        description: "Failed to load threat locations",
        variant: "destructive",
      })
    }
  }

  // Render threat locations on the map
  const renderThreatLocations = (map: any, locations: ThreatLocation[]) => {
    // Clear existing threat markers
    threatMarkersRef.current.forEach((marker) => marker.remove())
    threatMarkersRef.current = []

    locations.forEach((location) => {
      // Create marker element based on threat level
      const markerElement = document.createElement("div")
      markerElement.className = "threat-marker"

      let color
      switch (location.threatLevel) {
        case "high":
          color = "#ef4444" // bright red for high threats
          break
        case "medium":
          color = "#f59e0b" // amber for medium threats
          break
        case "low":
          color = "#10b981" // green for low threats
          break
        default:
          color = "#9ca3af" // gray for unknown
      }

      // Update the marker creation with more visible styling
      const icon = window.L.divIcon({
        html: `<div class="flex items-center justify-center w-10 h-10">
                <div class="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center animate-pulse">
                  <div class="w-6 h-6 rounded-full flex items-center justify-center" style="background-color: ${color}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  </div>
                </div>
              </div>`,
        className: 'threat-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      
      const marker = window.L.marker([location.latitude, location.longitude], {
        icon: icon
      }).addTo(map)

      // Add popup with location details
      marker.bindPopup(`
        <div class="p-1">
          <h3 class="font-bold text-saheli-primary">${location.name}</h3>
          <p class="text-sm">${location.description}</p>
          <p class="text-xs mt-1">
            <span class="inline-block px-2 py-0.5 rounded-full text-white text-xs font-medium" 
              style="background-color: ${color}">
              ${location.threatLevel.charAt(0).toUpperCase() + location.threatLevel.slice(1)}
            </span>
            ${
              location.category
                ? `<span class="inline-block px-2 py-0.5 rounded-full bg-saheli-light text-saheli-primary text-xs font-medium ml-1">
                ${formatCategory(location.category)}
              </span>`
                : ""
            }
          </p>
          <p class="text-xs text-gray-500 mt-1">Reported: ${new Date(location.reportedAt).toLocaleDateString()}</p>
          ${
            location.verified
              ? '<p class="text-xs text-green-600 mt-1">✓ Verified by community</p>'
              : '<p class="text-xs text-gray-500 mt-1">Pending verification</p>'
          }
          <div class="mt-2 text-xs">
            <button class="text-saheli-secondary hover:underline mr-3">Confirm</button>
            <button class="text-gray-500 hover:underline">Dispute</button>
          </div>
        </div>
      `)

      threatMarkersRef.current.push(marker)
    })
  }

  const formatCategory = (category: string): string => {
    switch (category) {
      case "harassment":
        return "Harassment"
      case "theft":
        return "Theft"
      case "assault":
        return "Assault"
      case "poorLighting":
        return "Poor Lighting"
      case "isolation":
        return "Isolation"
      case "other":
        return "Other"
      default:
        return category
    }
  }

  // Add user marker to the map
  const addUserMarker = (map: any, location: UserLocation) => {
    if (!map) return

    // Clear existing user marker
    markersRef.current.forEach((marker) => {
      if (marker.isUserMarker) {
        marker.remove()
      }
    })

    // Create a custom marker element
    const markerElement = document.createElement("div")
    markerElement.className = "user-marker"
    markerElement.innerHTML = `
      <div class="w-10 h-10 bg-saheli-secondary rounded-full flex items-center justify-center animate-pulse shadow-lg">
        <div class="w-8 h-8 bg-saheli-primary rounded-full flex items-center justify-center">
          <div class="w-6 h-6 bg-white rounded-full"></div>
        </div>
      </div>
    `

    // Add marker to the map
    const icon = window.L.divIcon({
      html: markerElement.outerHTML,
      className: 'user-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })
    const marker = window.L.marker([location.latitude, location.longitude], {
      icon: icon
    }).addTo(map)

    marker.isUserMarker = true
    markersRef.current.push(marker)

    return marker
  }

  // Add sample geofences for demonstration
  const addSampleGeofences = () => {
    if (!userLocation) return

    // Create a safe zone around user's location
    const safeZone = createCircularGeofence(
      "safe-zone-1",
      "Home Safe Zone",
      "safe",
      { latitude: userLocation.latitude, longitude: userLocation.longitude },
      0.5, // 500m radius
      { description: "Area around home with good lighting and security" },
    )

    // Create a caution zone
    const cautionZone = createCircularGeofence(
      "caution-zone-1",
      "Park Area",
      "caution",
      {
        latitude: userLocation.latitude + 0.01,
        longitude: userLocation.longitude - 0.01,
      },
      0.3, // 300m radius
      { description: "Park area with limited lighting at night" },
    )

    // Create a danger zone
    const dangerZone = createCircularGeofence(
      "danger-zone-1",
      "Isolated Street",
      "danger",
      {
        latitude: userLocation.latitude - 0.01,
        longitude: userLocation.longitude + 0.015,
      },
      0.2, // 200m radius
      { description: "Isolated area with history of incidents" },
    )

    // Add geofences to the ref
    geofencesRef.current = [safeZone, cautionZone, dangerZone]
  }

  // Render geofences on the map
  const renderGeofences = (map: any) => {
    if (!map) return

    geofencesRef.current.forEach((geofence) => {
      if (geofence.radius && geofence.points.length === 1) {
        // Render circular geofence
        const center = geofence.points[0]
        let color = ""
        const fillOpacity = 0.2

        switch (geofence.type) {
          case "safe":
            color = "#748478" // xanadu (green)
            break
          case "caution":
            color = "#f48c4c" // jaffa (orange)
            break
          case "danger":
            color = "#f98661" // tan-hide (accent)
            break
        }

        const circle = window.L.circle([center.latitude, center.longitude], {
          radius: geofence.radius * 1000, // Convert km to meters
          color,
          fillColor: color,
          fillOpacity,
          weight: 2,
        }).addTo(map)

        // Add a popup with geofence information
        circle.bindPopup(`
          <div>
            <h3 class="font-bold">${geofence.name}</h3>
            <p>${geofence.metadata?.description || ""}</p>
            <p class="text-sm">Type: ${geofence.type}</p>
          </div>
        `)
      } else if (geofence.points.length >= 3) {
        // Render polygon geofence
        const points = geofence.points.map((point) => [point.latitude, point.longitude])
        let color = ""
        const fillOpacity = 0.2

        switch (geofence.type) {
          case "safe":
            color = "#748478" // xanadu (green)
            break
          case "caution":
            color = "#f48c4c" // jaffa (orange)
            break
          case "danger":
            color = "#f98661" // tan-hide (accent)
            break
        }

        const polygon = window.L.polygon(points, {
          color,
          fillColor: color,
          fillOpacity,
          weight: 2,
        }).addTo(map)

        // Add a popup with geofence information
        polygon.bindPopup(`
          <div>
            <h3 class="font-bold">${geofence.name}</h3>
            <p>${geofence.metadata?.description || ""}</p>
            <p class="text-sm">Type: ${geofence.type}</p>
          </div>
        `)
      }
    })
  }

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim() || !tomtomMapRef.current) return

    setLoading(true)

    try {
      // Get current map center for context
      const mapCenter = tomtomMapRef.current.getCenter();
      
      const results = await searchLocations({
        query: searchQuery,
        center: [mapCenter.lat, mapCenter.lng],
        radius: 10000,
        limit: 5,
      })

      console.log("Search results:", results); // Add logging to debug

      if (results && results.results && results.results.length > 0) {
        setSearchResults(results.results)
        setShowSearchResults(true)
      } else {
        // Show a message if no results
        toast({
          title: "No results found",
          description: "Try a different search term or location",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error searching locations:", error)
      toast({
        title: "Search error",
        description: "Failed to search locations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle location selection from search results
  const handleLocationSelect = (result: any) => {
    if (!tomtomMapRef.current) return

    const map = tomtomMapRef.current
    const position = result.position

    // Clear existing search result markers
    markersRef.current.forEach((marker) => {
      if (marker.isSearchMarker) {
        marker.remove()
      }
    })

    // Add marker for the selected location
    const marker = window.L.marker([position.lat, position.lng]).addTo(map)
    marker.isSearchMarker = true
    markersRef.current.push(marker)

    // Center map on the selected location
    map.setView([position.lat, position.lng], 15)

    // Close search results
    setShowSearchResults(false)

    // If in location selection mode, set the location
    if (locationSelectionMode === "start") {
      setStartLocation({
        lat: position.lat,
        lng: position.lng,
        name: result.poi?.name || result.address.freeformAddress,
      })
      addStartMarker(position.lat, position.lng)
      setLocationSelectionMode("none")

      toast({
        title: "Start location set",
        description: "Click 'Plan Route' to calculate a safe route",
      })
    } else if (locationSelectionMode === "end") {
      setEndLocation({
        lat: position.lat,
        lng: position.lng,
        name: result.poi?.name || result.address.freeformAddress,
      })
      addEndMarker(position.lat, position.lng)
      setLocationSelectionMode("none")

      toast({
        title: "End location set",
        description: "Click 'Plan Route' to calculate a safe route",
      })
    }
  }

  // Enhanced function to open route in Google Maps with traffic and travel mode
  const openInGoogleMaps = () => {
    if (!startLocation || !endLocation) return;
    
    // Base URL
    let googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startLocation.lat},${startLocation.lng}&destination=${endLocation.lat},${endLocation.lng}&travelmode=${travelMode}`;
    
    // Add avoid parameters if needed
    const avoidParams = [];
    if (avoidTraffic) avoidParams.push('traffic');
    if (routeOptions.avoidHighways) avoidParams.push('highways');
    if (routeOptions.avoidTolls) avoidParams.push('tolls');
    if (routeOptions.avoidFerries) avoidParams.push('ferries');
    
    if (avoidParams.length > 0) {
      googleMapsUrl += `&avoid=${avoidParams.join('|')}`;
    }
    
    // Add traffic layer if requested
    googleMapsUrl += `&traffic_layer=${avoidTraffic ? '1' : '0'}`;
    
    // If considering geofences, add waypoints to route around dangerous areas
    if (considerGeofences && threatLocations.length > 0 && routeLayerRef.current?.avoidWaypoints) {
      // Get safe waypoints if they exist from the calculated route
      const waypoints = routeLayerRef.current.avoidWaypoints
        .map((wp: {lat: number, lng: number}) => `${wp.lat},${wp.lng}`)
        .join('|');
      
      if (waypoints) {
        googleMapsUrl += `&waypoints=${waypoints}`;
      }
    }
    
    // Open in a new tab
    window.open(googleMapsUrl, '_blank');
  };
  
  // Toggle navigation options dropdown
  const toggleNavOptions = () => {
    setShowNavOptions(!showNavOptions);
  };

  // Calculate and display a safe route
  const calculateSafeRoute = async () => {
    if (!tomtomMapRef.current || (!startLocation && !endLocation)) {
      toast({
        title: "Missing locations",
        description: "Please set both start and destination locations first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setRouteCalculated(false); // Reset route calculated state

    try {
      // Handle manually entered addresses by geocoding if needed
      let startCoords = startLocation;
      let endCoords = endLocation;
      
      // If we have a start location name but no coordinates, try to geocode
      if (startLocation && (startLocation.lat === 0 || !startLocation.lat)) {
        try {
          const results = await searchLocations({
            query: startLocation.name,
            limit: 1
          });
          
          if (results && results.results && results.results.length > 0) {
            const result = results.results[0];
            startCoords = {
              lat: result.position.lat,
              lng: result.position.lng,
              name: startLocation.name
            };
            
            // Update marker on the map
            addStartMarker(result.position.lat, result.position.lng);
            
            // Update the state with geocoded coordinates
            setStartLocation(startCoords);
          } else {
            throw new Error(`Couldn't find location: ${startLocation.name}`);
          }
        } catch (error) {
          console.error("Error geocoding start location:", error);
          toast({
            title: "Location Error",
            description: `Couldn't find "${startLocation.name}". Please try a different address or select on the map.`,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }
      
      // If we have an end location name but no coordinates, try to geocode
      if (endLocation && (endLocation.lat === 0 || !endLocation.lat)) {
        try {
          const results = await searchLocations({
            query: endLocation.name,
            limit: 1
          });
          
          if (results && results.results && results.results.length > 0) {
            const result = results.results[0];
            endCoords = {
              lat: result.position.lat,
              lng: result.position.lng,
              name: endLocation.name
            };
            
            // Update marker on the map
            addEndMarker(result.position.lat, result.position.lng);
            
            // Update the state with geocoded coordinates
            setEndLocation(endCoords);
          } else {
            throw new Error(`Couldn't find location: ${endLocation.name}`);
          }
        } catch (error) {
          console.error("Error geocoding end location:", error);
          toast({
            title: "Location Error",
            description: `Couldn't find "${endLocation.name}". Please try a different address or select on the map.`,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      // Remove existing routes
      if (routeLayerRef.current) {
        routeLayerRef.current.remove();
        routeLayerRef.current = null;
      }

      // Convert threat locations to avoid areas based on threat level
      const avoidThreatParams = routeOptions.avoidThreatLocations 
        ? threatLocations.map(threat => {
            // Create larger avoid radius for higher threat levels
            const avoidRadius = 
              threat.threatLevel === 'high' ? 0.5 :  // 500m for high threats
              threat.threatLevel === 'medium' ? 0.3 : // 300m for medium threats
              0.1; // 100m for low threats
              
            return {
              latitude: threat.latitude,
              longitude: threat.longitude,
              threatLevel: threat.threatLevel,
              radius: avoidRadius  // Add radius to avoid parameter
            };
          })
        : [];

      console.log("Calculating route with: ", {
        start: startCoords,
        end: endCoords,
        avoidAreas: avoidThreatParams
      });

      // Add null check before using coordinates
      if (!startCoords || !endCoords) {
        throw new Error("Start or end location coordinates are missing");
      }

      // Calculate route
      const routeResponse = await calculateRoute({
        locations: [
          [startCoords.lat, startCoords.lng],
          [endCoords.lat, endCoords.lng],
        ],
        avoid: [
          ...(routeOptions.avoidHighways ? ["highways"] : []),
          ...(routeOptions.avoidTolls ? ["tollRoads"] : []),
          ...(routeOptions.avoidFerries ? ["ferries"] : []),
          "unpavedRoads",
        ],
        avoidAreas: avoidThreatParams
      });

      console.log("Route response:", routeResponse);
      
      if (!routeResponse || !routeResponse.routes || routeResponse.routes.length === 0) {
        throw new Error("No route found between these locations. Please try different locations.");
      }

      // Get the route from the response - use first route
      const route = routeResponse.routes[0];
      
      if (!route || !route.legs || route.legs.length === 0 || !route.legs[0].points) {
        throw new Error("Invalid route data returned. Please try again.");
      }

      // Create a GeoJSON feature from the route geometry
      const routeGeoJSON = {
        type: "Feature",
        geometry: route.legs[0].points,
        properties: {},
      };

      // Add the route to the map with styling based on safety preference
      const routeLayer = window.L.geoJSON(routeGeoJSON, {
        style: routeOptions.avoidThreatLocations 
          ? {
              color: "#10b981", // green for safe route
              weight: 6,
              opacity: 0.8,
              lineCap: "round",
              lineJoin: "round",
            }
          : {
              color: "#813982", // purple for standard route
              weight: 6,
              opacity: 0.8,
              lineCap: "round",
              lineJoin: "round",
            }
      }).addTo(tomtomMapRef.current);

      // Store the route layer for later removal
      routeLayerRef.current = routeLayer;

      // Add route summary information
      const summary = route.legs[0].summary;
      const travelTimeMinutes = Math.round(summary.travelTimeInSeconds / 60);
      const distanceKm = (summary.lengthInMeters / 1000).toFixed(1);

      // Find avoided threats by checking which threats are near the route
      const nearbyThreats = threatLocations.filter(threat => {
        // Skip if we're not avoiding threats
        if (!routeOptions.avoidThreatLocations) return false;
        
        // Skip if startCoords or endCoords are null
        if (!startCoords || !endCoords) return false;
        
        // Calculate if this threat is near the start or end point
        const distToStart = calculateDistance(startCoords.lat, startCoords.lng, threat.latitude, threat.longitude);
        const distToEnd = calculateDistance(endCoords.lat, endCoords.lng, threat.latitude, threat.longitude);
        
        // Consider it "avoided" if it's within 1km of start/end
        return distToStart < 1 || distToEnd < 1;
      });
      
      // Add a popup with route information
      let popupContent;
      if (routeOptions.avoidThreatLocations) {
        popupContent = `
          <div class="p-2">
            <h3 class="font-bold text-saheli-primary">Safe Route</h3>
            <div class="flex items-center mt-1">
              <div class="bg-green-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">SAFEST PATH</div>
            </div>
            <div class="mt-2">
              <p><span class="font-medium">Distance:</span> ${distanceKm} km</p>
              <p><span class="font-medium">Estimated time:</span> ${travelTimeMinutes} min</p>
            </div>
            ${
              nearbyThreats.length > 0
                ? `
              <div class="mt-2">
                <p class="text-sm font-medium text-green-600">✓ Avoiding ${nearbyThreats.length} unsafe areas</p>
                <ul class="text-xs mt-1 text-gray-600">
                  ${nearbyThreats
                    .map(threat => `<li>• ${threat.name} (${threat.threatLevel})</li>`)
                    .join("")}
                </ul>
              </div>
            `
                : `<p class="text-sm text-green-600 mt-2">✓ No unsafe areas along this route</p>`
            }
          </div>
        `;
      } else {
        popupContent = `
          <div class="p-2">
            <h3 class="font-bold">Shortest Route</h3>
            <div class="flex items-center mt-1">
              <div class="bg-purple-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">DIRECT PATH</div>
            </div>
            <div class="mt-2">
              <p><span class="font-medium">Distance:</span> ${distanceKm} km</p>
              <p><span class="font-medium">Estimated time:</span> ${travelTimeMinutes} min</p>
            </div>
            <p class="text-sm text-amber-600 mt-1">⚠️ This route prioritizes speed over safety</p>
          </div>
        `;
      }
      
      routeLayer.bindPopup(popupContent).openPopup();

      // Fit the map to show the entire route with padding
      const bounds = routeLayer.getBounds();
      tomtomMapRef.current.fitBounds(bounds, {
        padding: [50, 50],
      });
      
      // Also show threat markers if they're near the route
      if (routeOptions.avoidThreatLocations && nearbyThreats.length > 0) {
        // Highlight the avoided threats
        nearbyThreats.forEach(threat => {
          // Create a circle to show the avoidance area
          const avoidRadius = 
            threat.threatLevel === 'high' ? 500 :   // 500m for high threats
            threat.threatLevel === 'medium' ? 300 : // 300m for medium threats
            100;                                    // 100m for low threats
            
          const color = 
            threat.threatLevel === 'high' ? '#ef4444' :   // red
            threat.threatLevel === 'medium' ? '#f59e0b' : // amber
            '#10b981';                                    // green
          
          // Add a circle to visualize the avoid area
          const circle = window.L.circle([threat.latitude, threat.longitude], {
            radius: avoidRadius,
            color: color,
            fillColor: color,
            fillOpacity: 0.2,
            weight: 1,
          }).addTo(tomtomMapRef.current);
          
          // Store the circle references for cleanup
          if (!routeLayerRef.current.avoidCircles) {
            routeLayerRef.current.avoidCircles = [];
          }
          routeLayerRef.current.avoidCircles.push(circle);
        });
      }
      
      // If traffic display is enabled, show traffic conditions
      if (avoidTraffic) {
        // Short delay to ensure the route layer is fully loaded
        setTimeout(() => {
          setShowTrafficLayer(true);
        }, 200);
      }
      
      // Set route as calculated
      setRouteCalculated(true);
      
      // Close the route dialog
      setShowRouteDialog(false);
      
      // Store waypoints for Google Maps integration
      if (considerGeofences) {
        // Create safe waypoints by identifying points along the route that are away from threats
        const waypoints: {lat: number, lng: number}[] = [];
        
        // Extract route points at regular intervals
        if (route.legs[0].points && route.legs[0].points.coordinates) {
          const coordinates = route.legs[0].points.coordinates;
          
          // Sample points along the route (every ~10% of the route)
          const numPoints = coordinates.length;
          const sampleInterval = Math.max(1, Math.floor(numPoints / 10));
          
          for (let i = 1; i < numPoints - 1; i += sampleInterval) {
            const point = coordinates[i];
            
            // Check if this point is a safe distance from all threats
            const isSafe = threatLocations.every(threat => {
              const distance = calculateDistance(
                point[1], // lat 
                point[0], // lng
                threat.latitude,
                threat.longitude
              );
              
              // Consider safe if at least 500m away from threats
              return distance > 0.5;
            });
            
            if (isSafe) {
              waypoints.push({ lat: point[1], lng: point[0] });
            }
          }
          
          // Store waypoints with the route layer for later use
          if (!routeLayerRef.current.avoidWaypoints) {
            routeLayerRef.current.avoidWaypoints = [];
          }
          
          routeLayerRef.current.avoidWaypoints = waypoints;
        }
      }

      // Parse turn-by-turn directions (simulate for now)
      const steps = [];
      if (route.legs[0].points && route.legs[0].points.coordinates) {
        const coords = route.legs[0].points.coordinates;
        for (let i = 1; i < coords.length; i++) {
          steps.push({
            from: coords[i - 1],
            to: coords[i],
            instruction: `Go to (${coords[i][1].toFixed(5)}, ${coords[i][0].toFixed(5)})`,
            distance: calculateDistance(coords[i - 1][1], coords[i - 1][0], coords[i][1], coords[i][0]),
          });
        }
      }
      setNavDirections(steps);
      // Calculate total distance and time
      let totalDistance = 0;
      steps.forEach((s) => (totalDistance += s.distance));
      let baseTime = route.legs[0].summary.travelTimeInSeconds / 60; // minutes
      // Simulate traffic factor
      const tf = avoidTraffic ? 1.3 : 1; // 30% more time if traffic is on
      setTrafficFactor(tf);
      setNavTime(Math.round(baseTime * tf));
      setNavDistance(Number(totalDistance.toFixed(2)));
    } catch (error) {
      console.error("Error calculating route:", error);
      toast({
        title: "Route Error",
        description: error instanceof Error ? error.message : "Failed to calculate route. Please try different locations.",
        variant: "destructive",
      });
      setRouteCalculated(false); // Ensure route calculated state is false on error
    } finally {
      setLoading(false);
    }
  }

  // Handle current location button click
  const handleCurrentLocation = async () => {
    if (!tomtomMapRef.current) {
      toast({
        title: "Error",
        description: "Map is not initialized. Please try refreshing the page.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Show user prompt explaining why we need location
      toast({
        title: "Requesting location",
        description: "Please allow location access to center the map on your position.",
      });
      
      // Request location with timeout
      const position = await getCurrentPosition();
      
      const userPos: UserLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date(),
        speed: position.coords.speed || undefined,
        heading: position.coords.heading || undefined,
      };

      setUserLocation(userPos);

      // Update user marker
      addUserMarker(tomtomMapRef.current, userPos);

      // Center map on user location
      tomtomMapRef.current.setView([userPos.latitude, userPos.longitude], 15);
      
      toast({
        title: "Location Updated",
        description: "Map centered on your current location.",
      });
    } catch (error) {
      console.error("Error getting current location:", error);
      
      // Extract the error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to get your location. Please check your location permissions.";
      
      // Give more helpful instructions based on common browsers
      const isChrome = navigator.userAgent.indexOf("Chrome") > -1;
      const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
      const isSafari = navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1;
      
      let helpText = "You may need to enable location services in your browser settings.";
      
      if (isChrome) {
        helpText = "In Chrome, click the lock/info icon in the address bar and enable location permissions.";
      } else if (isFirefox) {
        helpText = "In Firefox, click the lock icon in the address bar and enable location permissions.";
      } else if (isSafari) {
        helpText = "In Safari, go to Settings > Websites > Location and allow for this site.";
      }
      
      toast({
        title: "Location Access Needed",
        description: `${errorMessage} ${helpText}`,
        variant: "destructive",
        duration: 10000,
      });
      
      // Fall back to default location
      if (tomtomMapRef.current) {
        const defaultCoords = [77.580643, 12.972442]; // Bangalore
        tomtomMapRef.current.setView([defaultCoords[1], defaultCoords[0]], 13);
        toast({
          title: "Using default location",
          description: "Showing Bangalore, India as default location.",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  // Handle adding a new threat location
  const handleAddThreat = () => {
    const currentUser = auth.getCurrentUser()
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to report a threat location",
        variant: "destructive",
      })
      return
    }

    setShowAddThreatDialog(true)
  }

  // Handle successful threat location addition
  const handleThreatAdded = () => {
    setShowAddThreatDialog(false)
    setSelectedLocation(null)
    loadThreatLocations()

    toast({
      title: "Threat location added",
      description: "Thank you for contributing to community safety",
      variant: "default",
    })
  }

  // Handle route planning
  const handlePlanRoute = () => {
    setShowRouteDialog(true)
  }

  // Handle setting start location
  const handleSetStartLocation = () => {
    setLocationSelectionMode("start")
    
    // Clear any existing marker
    if (startMarkerRef.current) {
      startMarkerRef.current.remove();
      startMarkerRef.current = null;
    }

    toast({
      title: "Select start location",
      description: "Click on the map to set your starting point",
    })
  }

  // Handle setting end location
  const handleSetEndLocation = () => {
    setLocationSelectionMode("end")
    
    // Clear any existing marker
    if (endMarkerRef.current) {
      endMarkerRef.current.remove();
      endMarkerRef.current = null;
    }

    toast({
      title: "Select destination",
      description: "Click on the map to set your destination",
    })
  }

  // Handle context menu actions
  const handleContextMenuAction = (action: string) => {
    if (!contextMenuLocation) return

    setShowLocationContextMenu(false)

    switch (action) {
      case "start":
        setStartLocation({
          lat: contextMenuLocation.lat,
          lng: contextMenuLocation.lng,
          name: "Selected Location",
        })
        addStartMarker(contextMenuLocation.lat, contextMenuLocation.lng)
        toast({
          title: "Start location set",
          description: "Click 'Plan Route' to calculate a safe route",
        })
        break

      case "end":
        setEndLocation({
          lat: contextMenuLocation.lat,
          lng: contextMenuLocation.lng,
          name: "Selected Location",
        })
        addEndMarker(contextMenuLocation.lat, contextMenuLocation.lng)
        toast({
          title: "End location set",
          description: "Click 'Plan Route' to calculate a safe route",
        })
        break

      case "threat":
        setSelectedLocation(contextMenuLocation)
        setShowAddThreatDialog(true)
        break

      default:
        break
    }
  }

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowLocationContextMenu(false)
    }

    document.addEventListener("click", handleClickOutside)

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  const getTomTomApiKey = () => "" // No API key needed

  // Handle typing in start location field
  const handleStartLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartLocation(startLocation ? {...startLocation, name: value} : { lat: 0, lng: 0, name: value });
    
    // Clear previous timer
    if (typingTimer) clearTimeout(typingTimer);
    
    // Only search for suggestions if input is at least 3 characters
    if (value.length < 3) {
      setStartLocationSuggestions([]);
      setShowStartSuggestions(false);
      return;
    }
    
    // Set a new timer to search after typing stops for 500ms
    setTypingTimer(setTimeout(() => {
      searchLocations({
        query: value,
        limit: 5
      })
      .then(results => {
        if (results && results.results && results.results.length > 0) {
          setStartLocationSuggestions(results.results);
          setShowStartSuggestions(true);
        } else {
          setStartLocationSuggestions([]);
          setShowStartSuggestions(false);
        }
      })
      .catch(error => {
        console.error("Error getting location suggestions:", error);
        setStartLocationSuggestions([]);
        setShowStartSuggestions(false);
      });
    }, 500));
  };
  
  // Handle typing in end location field
  const handleEndLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndLocation(endLocation ? {...endLocation, name: value} : { lat: 0, lng: 0, name: value });
    
    // Clear previous timer
    if (typingTimer) clearTimeout(typingTimer);
    
    // Only search for suggestions if input is at least 3 characters
    if (value.length < 3) {
      setEndLocationSuggestions([]);
      setShowEndSuggestions(false);
      return;
    }
    
    // Set a new timer to search after typing stops for 500ms
    setTypingTimer(setTimeout(() => {
      searchLocations({
        query: value,
        limit: 5
      })
      .then(results => {
        if (results && results.results && results.results.length > 0) {
          setEndLocationSuggestions(results.results);
          setShowEndSuggestions(true);
        } else {
          setEndLocationSuggestions([]);
          setShowEndSuggestions(false);
        }
      })
      .catch(error => {
        console.error("Error getting location suggestions:", error);
        setEndLocationSuggestions([]);
        setShowEndSuggestions(false);
      });
    }, 500));
  };
  
  // Handle selecting a start location suggestion
  const handleSelectStartSuggestion = (suggestion: any) => {
    const location = {
      lat: suggestion.position.lat,
      lng: suggestion.position.lng,
      name: suggestion.address.freeformAddress || suggestion.poi?.name
    };
    
    setStartLocation(location);
    addStartMarker(location.lat, location.lng);
    setShowStartSuggestions(false);
    
    if (tomtomMapRef.current) {
      tomtomMapRef.current.setView([location.lat, location.lng], 15);
    }
  };
  
  // Handle selecting an end location suggestion
  const handleSelectEndSuggestion = (suggestion: any) => {
    const location = {
      lat: suggestion.position.lat,
      lng: suggestion.position.lng,
      name: suggestion.address.freeformAddress || suggestion.poi?.name
    };
    
    setEndLocation(location);
    addEndMarker(location.lat, location.lng);
    setShowEndSuggestions(false);
    
    if (tomtomMapRef.current) {
      tomtomMapRef.current.setView([location.lat, location.lng], 15);
    }
  };
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showStartSuggestions || showEndSuggestions) {
        // Check if click is outside the suggestions
        const target = e.target as HTMLElement;
        if (!target.closest('.location-suggestions')) {
          setShowStartSuggestions(false);
          setShowEndSuggestions(false);
        }
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showStartSuggestions, showEndSuggestions]);

  // Handle Enter key in start location input
  const handleStartLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (!startLocation || !startLocation.name) return;
      setShowStartSuggestions(false);
      
      // If we have suggestions and Enter is pressed, use the first suggestion
      if (startLocationSuggestions.length > 0) {
        handleSelectStartSuggestion(startLocationSuggestions[0]);
      } else {
        // Otherwise try to geocode directly
        setLoading(true);
        searchLocations({
          query: startLocation.name,
          limit: 1
        })
        .then(results => {
          if (results && results.results && results.results.length > 0) {
            handleSelectStartSuggestion(results.results[0]);
          } else {
            toast({
              title: "Location not found",
              description: `Could not find "${startLocation.name}". Try a more specific address.`,
              variant: "destructive",
            });
          }
        })
        .catch(error => {
          console.error("Error geocoding address:", error);
          toast({
            title: "Geocoding error",
            description: "Could not find this location. Please try a different address.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setLoading(false);
        });
      }
    }
  };
  
  // Handle Enter key in end location input
  const handleEndLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (!endLocation || !endLocation.name) return;
      setShowEndSuggestions(false);
      
      // If we have suggestions and Enter is pressed, use the first suggestion
      if (endLocationSuggestions.length > 0) {
        handleSelectEndSuggestion(endLocationSuggestions[0]);
      } else {
        // Otherwise try to geocode directly
        setLoading(true);
        searchLocations({
          query: endLocation.name,
          limit: 1
        })
        .then(results => {
          if (results && results.results && results.results.length > 0) {
            handleSelectEndSuggestion(results.results[0]);
          } else {
            toast({
              title: "Location not found",
              description: `Could not find "${endLocation.name}". Try a more specific address.`,
              variant: "destructive",
            });
          }
        })
        .catch(error => {
          console.error("Error geocoding address:", error);
          toast({
            title: "Geocoding error",
            description: "Could not find this location. Please try a different address.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setLoading(false);
        });
      }
    }
  };

  // Function to simulate traffic data and display it on the map
  const displayTrafficConditions = () => {
    if (!tomtomMapRef.current || !routeLayerRef.current) return;
    
    // Remove existing traffic layer if it exists
    if (trafficLayerRef.current) {
      trafficLayerRef.current.remove();
      trafficLayerRef.current = null;
    }
    
    // If traffic visualization is disabled, return
    if (!showTrafficLayer) return;
    
    // Extract route coordinates
    if (routeLayerRef.current?._layers) {
      // Find the route layer in the GeoJSON layers
      const layers = Object.values(routeLayerRef.current._layers);
      if (layers.length === 0) return;
      
      const routeLayer = layers[0] as any;
      if (!routeLayer?._latlngs) return;
      
      const routePoints = routeLayer._latlngs;
      const trafficSegments = [];
      
      // Create traffic segments with different congestion levels
      // We'll simulate traffic by assigning different colors to segments
      for (let i = 0; i < routePoints.length - 1; i++) {
        // Randomly decide traffic level (for simulation)
        // In a real implementation, this would come from a traffic API
        const trafficLevel = Math.random();
        let color;
        
        if (trafficLevel < 0.6) {
          // Low traffic (60% chance)
          color = '#34A853'; // green
        } else if (trafficLevel < 0.85) {
          // Medium traffic (25% chance)
          color = '#FBBC05'; // yellow
        } else {
          // High traffic (15% chance)
          color = '#EB4335'; // red
        }
        
        // Create a line segment with appropriate styling
        const segment = window.L.polyline(
          [routePoints[i], routePoints[i + 1]],
          {
            color: color,
            weight: 5,
            opacity: 0.7,
            lineCap: 'round',
            lineJoin: 'round',
            dashArray: trafficLevel > 0.85 ? '10, 10' : null, // Dashed line for heavy traffic
          }
        ).addTo(tomtomMapRef.current);
        
        // Add popup with traffic info
        let trafficInfo;
        if (trafficLevel < 0.6) {
          trafficInfo = 'Low traffic - Good flow';
        } else if (trafficLevel < 0.85) {
          trafficInfo = 'Moderate traffic - Some delays';
        } else {
          trafficInfo = 'Heavy traffic - Significant delays';
        }
        
        segment.bindPopup(`<div class="p-2">
          <h4 class="font-medium">${trafficInfo}</h4>
          <p class="text-sm">Estimated delay: ${Math.round(trafficLevel * 10)} min</p>
        </div>`);
        
        trafficSegments.push(segment);
      }
      
      // Store reference to traffic layers for later removal
      trafficLayerRef.current = window.L.layerGroup(trafficSegments).addTo(tomtomMapRef.current);
      
      // Add traffic legend
      if (!document.getElementById('traffic-legend') && tomtomMapRef.current) {
        const legend = window.L.control({ position: 'bottomleft' });
        
        legend.onAdd = () => {
          const div = window.L.DomUtil.create('div', 'bg-white dark:bg-gray-800 p-2 rounded-md shadow-md text-xs');
          div.id = 'traffic-legend';
          div.innerHTML = `
            <div class="mb-1 font-medium">Traffic Conditions</div>
            <div class="flex items-center mb-1">
              <div class="h-2 w-4 bg-green-600 mr-1 rounded"></div>
              <span>Free flow</span>
            </div>
            <div class="flex items-center mb-1">
              <div class="h-2 w-4 bg-yellow-500 mr-1 rounded"></div>
              <span>Some congestion</span>
            </div>
            <div class="flex items-center">
              <div class="h-2 w-4 bg-red-600 mr-1 rounded"></div>
              <span>Heavy traffic</span>
            </div>
          `;
          return div;
        };
        
        legend.addTo(tomtomMapRef.current);
      }
    }
  };
  
  // Watch for changes to showTrafficLayer state
  useEffect(() => {
    displayTrafficConditions();
  }, [showTrafficLayer]);
  
  // Update avoidTraffic to also toggle traffic visualization
  const toggleTraffic = (checked: boolean) => {
    setAvoidTraffic(checked);
    setShowTrafficLayer(checked);
  };

  // Add state for in-app navigation
  const [showInAppNav, setShowInAppNav] = useState(false);
  const [navStep, setNavStep] = useState(0);
  const [navDirections, setNavDirections] = useState<any[]>([]);
  const [navTime, setNavTime] = useState(0);
  const [navDistance, setNavDistance] = useState(0);
  const [trafficFactor, setTrafficFactor] = useState(1);

  // Function to open in-app navigation modal
  const openInAppNavigation = () => {
    setShowInAppNav(true);
    setNavStep(0);
  };

  // Function to close in-app navigation
  const closeInAppNavigation = () => {
    setShowInAppNav(false);
    setNavStep(0);
  };

  // Function to step navigation
  const nextNavStep = () => setNavStep((s) => Math.min(s + 1, navDirections.length - 1));
  const prevNavStep = () => setNavStep((s) => Math.max(s - 1, 0));

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <TabsList className="bg-saheli-light w-full sm:w-auto">
            <TabsTrigger 
              value="map" 
              className="data-[state=active]:bg-saheli-secondary data-[state=active]:text-white"
            >
              <MapIcon className="h-4 w-4 mr-2" />
              Map View
            </TabsTrigger>
            <TabsTrigger 
              value="route" 
              className="data-[state=active]:bg-saheli-primary data-[state=active]:text-white"
            >
              <Route className="h-4 w-4 mr-2" />
              Route Planning
            </TabsTrigger>
            <TabsTrigger 
              value="safety" 
              className="data-[state=active]:bg-saheli-green data-[state=active]:text-white"
            >
              <Shield className="h-4 w-4 mr-2" />
              Safety Zones
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              onClick={handleCurrentLocation}
              className="bg-white hover:bg-saheli-light shadow-sm border-saheli-mauve"
            >
              <LocateFixed className="h-4 w-4 mr-2 text-saheli-primary" />
              My Location
            </Button>
          </div>
        </div>

        <TabsContent value="map" className="mt-0">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-saheli-primary dark:text-saheli-accent" />
              <Input
                type="text"
                placeholder="Search for a location..."
                className="pl-9 border-saheli-mauve focus:border-saheli-primary dark:border-saheli-primary/30 dark:bg-saheli-dark dark:text-saheli-light"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-saheli-dark rounded-md shadow-lg border border-saheli-light dark:border-saheli-primary/30">
                  <ul className="py-1 max-h-60 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-saheli-light dark:hover:bg-saheli-primary/20 cursor-pointer"
                        onClick={() => handleLocationSelect(result)}
                      >
                        <div className="font-medium dark:text-saheli-light">
                          {result.poi?.name || result.address.freeformAddress}
                        </div>
                        <div className="text-sm text-muted-foreground dark:text-saheli-light/70">
                          {result.address.freeformAddress}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Button
              onClick={handleSearch}
              className="bg-saheli-accent hover:bg-saheli-accent/90 text-white shadow-md dark:bg-saheli-primary dark:hover:bg-saheli-primary/90"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="route" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="start-location">Start Location</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-saheli-secondary" />
                  <Input
                    id="start-location"
                    placeholder="Select start location"
                    className="pl-9 border-saheli-mauve focus:border-saheli-secondary"
                    value={startLocation?.name || ""}
                    onChange={handleStartLocationChange}
                    onKeyDown={handleStartLocationKeyDown}
                  />
                  {/* Start location suggestions */}
                  {showStartSuggestions && startLocationSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-saheli-dark rounded-md shadow-lg border border-saheli-light dark:border-saheli-primary/30 location-suggestions">
                      <ul className="py-1 max-h-48 overflow-y-auto">
                        {startLocationSuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="px-4 py-2 hover:bg-saheli-light dark:hover:bg-saheli-primary/20 cursor-pointer"
                            onClick={() => handleSelectStartSuggestion(suggestion)}
                          >
                            <div className="font-medium dark:text-saheli-light">
                              {suggestion.poi?.name || suggestion.address.freeformAddress}
                            </div>
                            {suggestion.poi?.name && (
                              <div className="text-sm text-muted-foreground dark:text-saheli-light/70">
                                {suggestion.address.freeformAddress}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleSetStartLocation}
                  className="bg-saheli-secondary hover:bg-saheli-secondary/90 text-white shadow-md"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Set
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-location">Destination</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-saheli-primary" />
                  <Input
                    id="end-location"
                    placeholder="Select destination"
                    className="pl-9 border-saheli-mauve focus:border-saheli-primary"
                    value={endLocation?.name || ""}
                    onChange={handleEndLocationChange}
                    onKeyDown={handleEndLocationKeyDown}
                  />
                  {/* End location suggestions */}
                  {showEndSuggestions && endLocationSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-saheli-dark rounded-md shadow-lg border border-saheli-light dark:border-saheli-primary/30 location-suggestions">
                      <ul className="py-1 max-h-48 overflow-y-auto">
                        {endLocationSuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="px-4 py-2 hover:bg-saheli-light dark:hover:bg-saheli-primary/20 cursor-pointer"
                            onClick={() => handleSelectEndSuggestion(suggestion)}
                          >
                            <div className="font-medium dark:text-saheli-light">
                              {suggestion.poi?.name || suggestion.address.freeformAddress}
                            </div>
                            {suggestion.poi?.name && (
                              <div className="text-sm text-muted-foreground dark:text-saheli-light/70">
                                {suggestion.address.freeformAddress}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleSetEndLocation}
                  className="bg-saheli-primary hover:bg-saheli-primary/90 text-white shadow-md"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Set
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="avoid-threats"
                checked={routeOptions.avoidThreatLocations}
                onCheckedChange={(checked) =>
                  setRouteOptions({ ...routeOptions, avoidThreatLocations: !!checked })
                }
              />
              <Label htmlFor="avoid-threats" className="text-sm font-medium">
                Avoid unsafe areas
              </Label>
            </div>

            <Button
              onClick={calculateSafeRoute}
              disabled={!startLocation || !endLocation}
              className="bg-gradient-to-r from-saheli-secondary to-saheli-primary text-white hover:opacity-90 shadow-md w-full sm:w-auto"
            >
              <Route className="h-4 w-4 mr-2" />
              Calculate Safe Route
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="safety" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <Button
              variant="outline"
              className="justify-start bg-white hover:bg-saheli-light shadow-sm border-saheli-accent"
              onClick={handleAddThreat}
            >
              <AlertTriangle className="h-4 w-4 mr-2 text-saheli-accent" />
              Report Unsafe Location
            </Button>
            <Button
              variant="outline"
              className="justify-start bg-white hover:bg-saheli-light shadow-sm border-saheli-green"
            >
              <Shield className="h-4 w-4 mr-2 text-saheli-green" />
              Create Safe Zone
            </Button>
            <Select>
              <SelectTrigger className="bg-white shadow-sm border-saheli-mauve">
                <SelectValue placeholder="Filter threat levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Threats</SelectItem>
                <SelectItem value="high">High Risk Only</SelectItem>
                <SelectItem value="medium">Medium Risk Only</SelectItem>
                <SelectItem value="low">Low Risk Only</SelectItem>
                <SelectItem value="verified">Verified Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>

      <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] bg-saheli-light dark:bg-saheli-dark/50 rounded-lg overflow-hidden shadow-lg">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-saheli-light/80 z-30">
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
              <Loader2 className="h-6 w-6 text-saheli-primary animate-spin" />
              <p className="text-saheli-primary font-medium">Loading...</p>
            </div>
          </div>
        )}
        <div 
          id="safety-map" 
          ref={mapRef} 
          className="w-full h-full absolute inset-0 z-10"
          style={{ minHeight: "400px" }}
        />

        {/* Location context menu */}
        {showLocationContextMenu && (
          <div
            className="fixed z-50 bg-white rounded-md shadow-lg border border-saheli-light py-1"
            style={{
              left: `${contextMenuPosition.x}px`,
              top: `${contextMenuPosition.y}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-saheli-light flex items-center"
              onClick={() => handleContextMenuAction("start")}
            >
              <MapPin className="h-4 w-4 mr-2 text-saheli-secondary" />
              Set as start location
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-saheli-light flex items-center"
              onClick={() => handleContextMenuAction("end")}
            >
              <MapPin className="h-4 w-4 mr-2 text-saheli-primary" />
              Set as destination
            </button>
            <div className="border-t my-1 border-saheli-light"></div>
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-saheli-light flex items-center"
              onClick={() => handleContextMenuAction("threat")}
            >
              <AlertTriangle className="h-4 w-4 mr-2 text-saheli-accent" />
              Report as unsafe
            </button>
          </div>
        )}

        {/* Add Google Maps button with enhanced options */}
        {routeCalculated && (
          <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center pointer-events-none">
            <div className="relative pointer-events-auto">
              <Button
                onClick={toggleNavOptions}
                className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white shadow-lg border border-gray-300 dark:border-gray-600 flex items-center gap-2 py-2 px-4 rounded-full transition-all duration-200 hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 262">
                  <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" />
                  <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" />
                  <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" />
                  <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" />
                </svg>
                <span>Navigate with Google Maps</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${showNavOptions ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </Button>
              
              {/* Navigation options dropdown */}
              {showNavOptions && (
                <div className="absolute bottom-full mb-2 right-0 left-auto w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[110]">
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Navigation Options</h4>
                    
                    {/* Travel mode selection */}
                    <div className="mb-4">
                      <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Travel Mode</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          type="button" 
                          variant={travelMode === 'driving' ? 'default' : 'outline'}
                          className={`py-1 ${travelMode === 'driving' ? 'bg-saheli-primary' : ''}`}
                          onClick={() => setTravelMode('driving')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
                            <circle cx="6.5" cy="16.5" r="2.5"/>
                            <circle cx="16.5" cy="16.5" r="2.5"/>
                          </svg>
                          Driving
                        </Button>
                        <Button 
                          type="button"
                          variant={travelMode === 'walking' ? 'default' : 'outline'}
                          className={`py-1 ${travelMode === 'walking' ? 'bg-saheli-primary' : ''}`}
                          onClick={() => setTravelMode('walking')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="M8 14.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
                            <path d="M8 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
                            <path d="M11 15.5v-5l6 6.5"/>
                            <path d="m14 6-4 4.5"/>
                            <path d="M4 7h4"/>
                            <path d="M4 11h4"/>
                          </svg>
                          Walking
                        </Button>
                        <Button 
                          type="button"
                          variant={travelMode === 'transit' ? 'default' : 'outline'}
                          className={`py-1 ${travelMode === 'transit' ? 'bg-saheli-primary' : ''}`}
                          onClick={() => setTravelMode('transit')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="M8 16V8H4m12 8V8h-4"/>
                            <rect x="1" y="3" width="20" height="16" rx="2"/>
                          </svg>
                          Transit
                        </Button>
                        <Button 
                          type="button"
                          variant={travelMode === 'bicycling' ? 'default' : 'outline'}
                          className={`py-1 ${travelMode === 'bicycling' ? 'bg-saheli-primary' : ''}`}
                          onClick={() => setTravelMode('bicycling')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <circle cx="5.5" cy="17.5" r="3.5"/>
                            <circle cx="18.5" cy="17.5" r="3.5"/>
                            <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/>
                          </svg>
                          Bicycling
                        </Button>
                      </div>
                    </div>
                    
                    {/* Traffic and safety options */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center">
                        <Checkbox 
                          id="avoid-traffic" 
                          checked={avoidTraffic} 
                          onCheckedChange={(checked) => toggleTraffic(!!checked)} 
                        />
                        <label htmlFor="avoid-traffic" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Show traffic conditions
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox 
                          id="consider-geofences"
                          checked={considerGeofences}
                          onCheckedChange={(checked) => setConsiderGeofences(!!checked)}
                        />
                        <label htmlFor="consider-geofences" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Consider safety geofences
                        </label>
                      </div>
                    </div>
                    
                    {/* Navigate button */}
                    <Button 
                      className="w-full bg-saheli-primary hover:bg-saheli-secondary"
                      onClick={() => {
                        openInGoogleMaps();
                        setShowNavOptions(false);
                      }}
                    >
                      Navigate Now
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border rounded-lg bg-white dark:bg-saheli-dark shadow-sm border-saheli-light dark:border-saheli-primary/20">
        <div className="text-sm font-medium mb-3 text-saheli-dark dark:text-saheli-light">Map Legend</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-emerald-500 rounded-full mr-2 ring-2 ring-white dark:ring-saheli-dark"></div>
            <span className="text-xs dark:text-saheli-light/80">Safe Zone</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-amber-500 rounded-full mr-2 ring-2 ring-white dark:ring-saheli-dark"></div>
            <span className="text-xs dark:text-saheli-light/80">Caution Zone</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-rose-500 rounded-full mr-2 ring-2 ring-white dark:ring-saheli-dark"></div>
            <span className="text-xs dark:text-saheli-light/80">Danger Zone</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-teal-500 rounded-full mr-2 ring-2 ring-white dark:ring-saheli-dark"></div>
            <span className="text-xs dark:text-saheli-light/80">Low Risk</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-orange-500 rounded-full mr-2 ring-2 ring-white dark:ring-saheli-dark"></div>
            <span className="text-xs dark:text-saheli-light/80">Medium Risk</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-red-500 rounded-full mr-2 ring-2 ring-white dark:ring-saheli-dark"></div>
            <span className="text-xs dark:text-saheli-light/80">High Risk</span>
          </div>
        </div>
      </div>

      {/* Add Threat Location Dialog */}
      <Dialog open={showAddThreatDialog} onOpenChange={setShowAddThreatDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-saheli-primary dark:text-saheli-accent">Report Unsafe Location</DialogTitle>
            <DialogDescription className="dark:text-saheli-light/70">
              Help keep the community safe by reporting locations that pose a safety risk.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto pr-1" style={{ maxHeight: "calc(90vh - 180px)" }}>
            <AddThreatLocationForm
              onSuccess={handleThreatAdded}
              onCancel={() => setShowAddThreatDialog(false)}
              initialLatitude={selectedLocation?.lat}
              initialLongitude={selectedLocation?.lng}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Route Planning Dialog */}
      <Dialog open={showRouteDialog} onOpenChange={setShowRouteDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-saheli-primary dark:text-saheli-accent">Plan Safe Route</DialogTitle>
            <DialogDescription className="dark:text-saheli-light/70">
              Configure your route options to find the safest path to your destination.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 overflow-y-auto pr-1" style={{ maxHeight: "calc(90vh - 180px)" }}>
            <div className="space-y-2">
              <Label className="font-medium">Route Preferences</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="avoid-threats-dialog"
                    checked={routeOptions.avoidThreatLocations}
                    onCheckedChange={(checked) =>
                      setRouteOptions({ ...routeOptions, avoidThreatLocations: !!checked })
                    }
                  />
                  <Label htmlFor="avoid-threats-dialog">Avoid unsafe areas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="prefer-safe-areas"
                    checked={routeOptions.preferSafeAreas}
                    onCheckedChange={(checked) =>
                      setRouteOptions({ ...routeOptions, preferSafeAreas: !!checked })
                    }
                  />
                  <Label htmlFor="prefer-safe-areas">Prefer well-lit and populated areas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="avoid-highways"
                    checked={routeOptions.avoidHighways}
                    onCheckedChange={(checked) =>
                      setRouteOptions({ ...routeOptions, avoidHighways: !!checked })
                    }
                  />
                  <Label htmlFor="avoid-highways">Avoid highways</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="avoid-tolls"
                    checked={routeOptions.avoidTolls}
                    onCheckedChange={(checked) => setRouteOptions({ ...routeOptions, avoidTolls: !!checked })}
                  />
                  <Label htmlFor="avoid-tolls">Avoid toll roads</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Maximum Detour</Label>
              <Select
                value={routeOptions.maxDetourTime?.toString() || "10"}
                onValueChange={(value) => {
                  const intValue = parseInt(value, 10);
                  if (!isNaN(intValue)) {
                    setRouteOptions({ ...routeOptions, maxDetourTime: intValue });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select maximum detour time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Up to 5 minutes</SelectItem>
                  <SelectItem value="10">Up to 10 minutes</SelectItem>
                  <SelectItem value="15">Up to 15 minutes</SelectItem>
                  <SelectItem value="20">Up to 20 minutes</SelectItem>
                  <SelectItem value="30">Up to 30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRouteDialog(false)}
              className="dark:border-saheli-primary/30 dark:text-saheli-light dark:hover:bg-saheli-primary/20"
            >
              Cancel
            </Button>
            <Button
              onClick={calculateSafeRoute}
              disabled={!startLocation || !endLocation}
              className="bg-gradient-to-r from-saheli-secondary to-saheli-primary text-white dark:from-saheli-accent dark:to-saheli-primary"
            >
              Calculate Safe Route
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating Google Maps and In-App Navigation Buttons */}
      {routeCalculated && (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-auto">
          <Button
            onClick={openInGoogleMaps}
            className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white shadow-lg border border-gray-300 dark:border-gray-600 flex items-center gap-2 py-2 px-4 rounded-full transition-all duration-200 hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 262">
              <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" />
              <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" />
              <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" />
              <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" />
            </svg>
            <span>Google Maps</span>
          </Button>
          <Button
            onClick={openInAppNavigation}
            className="bg-saheli-primary text-white hover:bg-saheli-secondary shadow-lg flex items-center gap-2 py-2 px-4 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19V6m0 0l-7 7m7-7l7 7" /></svg>
            <span>In-App Navigation</span>
          </Button>
        </div>
      )}

      {/* In-App Navigation Modal */}
      {showInAppNav && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-6 w-full max-w-md relative">
            <button onClick={closeInAppNavigation} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">✕</button>
            <h2 className="text-xl font-bold mb-2">In-App Navigation</h2>
            <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">Step {navStep + 1} of {navDirections.length}</div>
            <div className="mb-4 text-lg font-medium">{navDirections[navStep]?.instruction || 'Start your journey'}</div>
            <div className="mb-2 text-sm">Segment distance: {navDirections[navStep]?.distance?.toFixed(2) || 0} km</div>
            <div className="mb-4 text-sm">Total time: {navTime} min &nbsp;|&nbsp; Total distance: {navDistance} km</div>
            <div className="flex gap-2">
              <Button onClick={prevNavStep} disabled={navStep === 0}>Previous</Button>
              <Button onClick={nextNavStep} disabled={navStep === navDirections.length - 1}>Next</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

