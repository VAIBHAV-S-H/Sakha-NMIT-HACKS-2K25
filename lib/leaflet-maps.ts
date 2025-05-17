// This file contains utility functions for working with Leaflet Maps API

export interface MapOptions {
  center: [number, number] // [latitude, longitude]
  zoom: number
}

export interface RouteOptions {
  locations: [number, number][] // Array of [latitude, longitude] pairs
  avoid?: string[]
  avoidAreas?: Array<{
    latitude: number
    longitude: number
    threatLevel: 'low' | 'medium' | 'high'
  }>
}

export interface SearchOptions {
  query: string
  center?: [number, number]
  radius?: number
  limit?: number
}

export interface GeocodingResult {
  display_name: string
  lat: string
  lon: string
  boundingbox: string[]
  importance: number
  place_id: number
}

let sdkLoaded = false
let loadingPromise: Promise<void> | null = null

/**
 * Load the Leaflet Maps SDK script
 */
export function loadLeafletScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve()
  }

  if (sdkLoaded) {
    return Promise.resolve()
  }

  if (loadingPromise) {
    return loadingPromise
  }

  loadingPromise = new Promise((resolve, reject) => {
    // Load CSS first
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)

    // Load Maps SDK
    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.async = false

    script.onload = () => {
      console.log("Leaflet SDK loaded successfully")
      sdkLoaded = true
      loadingPromise = null
      resolve()
    }

    script.onerror = () => {
      console.error("Failed to load Leaflet SDK")
      loadingPromise = null
      reject(new Error("Failed to load Leaflet SDK"))
    }

    document.head.appendChild(script)
  })

  return loadingPromise
}

/**
 * Initialize a Leaflet map instance
 */
export async function initMap(containerId: string, options: MapOptions): Promise<any> {
  try {
    // Make sure we have a valid container ID
    if (!containerId) {
      console.error("No container ID provided for map initialization");
      return null;
    }
    
    // Check if we're in browser environment
    if (typeof window === "undefined") {
      console.log("Not in browser environment, skipping map initialization");
      return null;
    }
    
    // Make sure Leaflet is loaded first
    if (!window.L) {
      console.log("Leaflet not loaded, loading now...");
      await loadLeafletScript();
    }
    
    // Double-check Leaflet is loaded
    if (!window.L) {
      throw new Error("Failed to load Leaflet library");
    }
    
    // Check if there's an existing map on this container
    const mapContainer = document.getElementById(containerId);
    
    if (!mapContainer) {
      console.error(`Map container with ID "${containerId}" not found`);
      return null;
    }
    
    // More robust cleanup of existing map instances
    if (mapContainer) {
      // Check if this container already has a Leaflet map instance
      if (mapContainer.classList.contains('leaflet-container')) {
        console.log("Map already exists on this container, cleaning up first");
        
        try {
          // Get all map instances
          const maps = window.L.Map._instances || [];
          
          // Find any maps using this container
          for (let i = 0; i < maps.length; i++) {
            const existingMap = maps[i];
            if (existingMap._container && existingMap._container.id === containerId) {
              console.log("Found existing map instance, removing it");
              existingMap.remove();
              break;
            }
          }
          
          // As a fallback, also try to clean up the container directly
          mapContainer.innerHTML = '';
          mapContainer.classList.remove(
            'leaflet-container', 
            'leaflet-touch', 
            'leaflet-fade-anim', 
            'leaflet-grab', 
            'leaflet-touch-drag', 
            'leaflet-touch-zoom'
          );
        } catch (e) {
          console.warn("Couldn't fully clean up existing map:", e);
          // Still proceed with creating a new map
        }
      }
    }

    // Create the map instance with error handling
    let map;
    try {
      map = window.L.map(containerId, { 
        // This option helps prevent duplicate map creation issues
        reuseMap: true
      }).setView(options.center, options.zoom);
    } catch (mapError) {
      console.error("Error creating map instance:", mapError);
      // Try once more with a clean container
      mapContainer.innerHTML = '';
      
      // Small delay to ensure cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      map = window.L.map(containerId).setView(options.center, options.zoom);
    }

    // Add OpenStreetMap tile layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    return map;
  } catch (error) {
    console.error("Error initializing map:", error);
    return null; // Return null instead of throwing to prevent app crashes
  }
}

/**
 * Calculate a route between locations using OSRM
 */
export async function calculateRoute(options: RouteOptions): Promise<any> {
  if (typeof window === "undefined") return null;

  try {
    // Get threat locations from global state or pass them as parameter
    const threatLocations = options.avoidAreas || [];
    
    console.log("Calculate route options:", options);
    
    // OSRM expects coordinates as lon,lat
    const points = options.locations
      .map(([lat, lon]) => `${lon},${lat}`)
      .join(';');
    
    // Calculate multiple routes with alternatives
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${points}?overview=full&geometries=geojson&alternatives=true`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Routing API error:", errorText);
      throw new Error('Network response was not ok: ' + errorText);
    }
    
    const data = await response.json();
    
    console.log("Raw routing response:", data);
    
    if (!data.routes || data.routes.length === 0) {
      throw new Error("No routes found between these locations");
    }
    
    // If we have multiple routes and threat locations to avoid
    if (data.routes.length > 1 && threatLocations.length > 0) {
      // Score routes based on proximity to threat locations
      const scoredRoutes = data.routes.map((route: any) => {
        const coordinates = route.geometry.coordinates;
        let threatScore = 0;
        
        // Calculate how close the route comes to threat locations
        // For each point in the route, check distance to each threat
        threatLocations.forEach(threat => {
          coordinates.forEach((coord: [number, number]) => {
            const distance = calculateDistance(
              coord[1], coord[0], // lat, lon from route point
              threat.latitude, threat.longitude
            );
            
            // Calculate avoidance radius based on threat level
            const avoidRadius = 
              threat.radius || // Use provided radius if available
              (threat.threatLevel === 'high' ? 0.5 :
              threat.threatLevel === 'medium' ? 0.3 :
              0.1); // Default to 100m for low threats
            
            // Add to threat score based on proximity and threat level
            if (distance < avoidRadius * 2) { // Check within double the avoid radius
              const threatMultiplier = 
                threat.threatLevel === 'high' ? 5 :
                threat.threatLevel === 'medium' ? 3 : 1;
              
              // Higher score for closer proximity to threats
              // Distance factor is inverse to distance (closer = higher score)
              const distanceFactor = Math.max(0, 1 - (distance / avoidRadius));
              threatScore += distanceFactor * threatMultiplier;
            }
          });
        });
        
        // Consider route length as well - we want shortest SAFE route
        // Add a smaller weight to distance factor (0.2 compared to threat factor)
        const distanceFactor = route.distance / 1000 * 0.2; // km * weight
        
        return {
          ...route,
          threatScore,
          totalScore: threatScore + distanceFactor // Combined score of threats and distance
        };
      });
      
      console.log("Scored routes:", scoredRoutes.map(r => ({
        distance: r.distance, 
        duration: r.duration, 
        threatScore: r.threatScore,
        totalScore: r.totalScore
      })));
      
      // Sort routes by total score (lower is better)
      scoredRoutes.sort((a: { totalScore: number }, b: { totalScore: number }) => a.totalScore - b.totalScore);
      
      // Use the safest route
      const safeRoute = scoredRoutes[0];
      
      // Format the response to match expected structure
      return {
        routes: [{
          legs: [{
            points: safeRoute.geometry,
            summary: {
              lengthInMeters: safeRoute.distance,
              travelTimeInSeconds: safeRoute.duration
            }
          }]
        }]
      };
    }
    
    // Default return if no threat avoidance needed or only one route available
    return {
      routes: [{
        legs: [{
          points: data.routes[0].geometry,
          summary: {
            lengthInMeters: data.routes[0].distance,
            travelTimeInSeconds: data.routes[0].duration
          }
        }]
      }]
    };
  } catch (error) {
    console.error("Error calculating route:", error);
    throw error; // Propagate the error for better handling upstream
  }
}

// Helper function to calculate distance between two points in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

/**
 * Search for locations using OpenStreetMap Nominatim
 */
export async function searchLocations(options: SearchOptions): Promise<any> {
  if (typeof window === "undefined") return null

  try {
    // Add a slight delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const params = new URLSearchParams({
      q: options.query,
      format: 'json',
      limit: options.limit?.toString() || '5',
      addressdetails: '1' // Get detailed address information
    });
    
    if (options.center) {
      // Make the viewbox larger to get better results
      const delta = options.radius ? options.radius / 111000 : 0.2; // Convert meters to degrees (approx)
      params.append('viewbox', 
        `${options.center[1]-delta},${options.center[0]-delta},${options.center[1]+delta},${options.center[0]+delta}`);
      params.append('bounded', '0'); // Include results outside viewbox but rank them lower
    }
    
    console.log("Searching with params:", params.toString());
    
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'SaheliApp/1.0' // Add user agent to be polite to API
      }
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data: GeocodingResult[] = await response.json();
    console.log("Raw search results:", data);
    
    // Format the response with more details
    return {
      results: data.map(item => ({
        position: {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        },
        address: {
          freeformAddress: item.display_name
        },
        poi: {
          name: item.display_name.split(',')[0],
          categorySet: [{ id: 'location' }]
        }
      }))
    };
  } catch (error) {
    console.error("Error searching locations:", error);
    return { results: [] }; // Return empty results instead of null
  }
}

/**
 * Reverse geocode a location to get address information
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<any> {
  if (typeof window === "undefined") return null

  try {
    const params = new URLSearchParams({
      format: 'json',
      lat: latitude.toString(),
      lon: longitude.toString()
    })
    
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
      headers: {
        'Accept-Language': 'en'
      }
    })
    
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    
    return await response.json()
  } catch (error) {
    console.error("Error reverse geocoding:", error)
    return null
  }
}

// Add TypeScript interface for the window object to include Leaflet
declare global {
  interface Window {
    L: any
  }
}

