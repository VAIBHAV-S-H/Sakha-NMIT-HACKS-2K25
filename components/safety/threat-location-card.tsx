"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ThumbsUp, ThumbsDown, MapPin, Calendar, Shield, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { auth } from "@/lib/auth"
import type { ThreatLocation } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ThreatLocationCardProps {
  location: ThreatLocation
  onDelete?: () => void
  onUpdate?: () => void
}

export function ThreatLocationCard({ location, onDelete, onUpdate }: ThreatLocationCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [votes, setVotes] = useState(location.votes)
  const { toast } = useToast()

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleVote = async (upvote: boolean) => {
    const currentUser = auth.getCurrentUser()
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote on threat locations",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/threat-locations/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: location.id,
          upvote,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to vote")
      }

      const updatedLocation = await response.json()
      setVotes(updatedLocation.votes)

      toast({
        title: "Vote recorded",
        description: upvote ? "Thank you for confirming this threat location" : "Thank you for your feedback",
        variant: "default",
      })
    } catch (error) {
      console.error("Error voting:", error)
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    const currentUser = auth.getCurrentUser()
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to delete threat locations",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/threat-locations?id=${location.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete location")
      }

      toast({
        title: "Location deleted",
        description: "The threat location has been successfully deleted",
        variant: "default",
      })

      if (onDelete) {
        onDelete()
      }
    } catch (error) {
      console.error("Error deleting location:", error)
      toast({
        title: "Error",
        description: "Failed to delete location. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setConfirmDelete(false)
    }
  }

  const canDelete = () => {
    const currentUser = auth.getCurrentUser()
    if (!currentUser) return false

    // Allow deletion by the original reporter or an admin
    return location.reportedBy === currentUser.id || currentUser.email.includes("admin")
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-saheli-danger" />
                {location.name}
              </CardTitle>
              <div className="flex items-center mt-1 space-x-2">
                <Badge className={getThreatLevelColor(location.threatLevel)}>
                  {location.threatLevel.charAt(0).toUpperCase() + location.threatLevel.slice(1)} Threat
                </Badge>
                {location.verified && (
                  <Badge variant="outline" className="border-saheli-success text-saheli-success">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            {canDelete() && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setConfirmDelete(true)}
                className="text-saheli-danger hover:text-saheli-danger/80"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{location.description}</p>

          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-4">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span>Lat: {location.latitude.toFixed(4)}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span>Long: {location.longitude.toFixed(4)}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Reported: {new Date(location.reportedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <ThumbsUp className="h-3 w-3 mr-1" />
              <span>{votes} confirmations</span>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              className="text-saheli-success border-saheli-success hover:bg-saheli-success/10"
              onClick={() => handleVote(true)}
              disabled={loading}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Confirm
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-saheli-danger border-saheli-danger hover:bg-saheli-danger/10"
              onClick={() => handleVote(false)}
              disabled={loading}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              Dispute
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the threat location. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-saheli-danger hover:bg-saheli-danger/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

