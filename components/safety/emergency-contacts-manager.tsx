"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Phone, Save, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { db } from "@/lib/db"
import type { EmergencyContact } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export function EmergencyContactsManager({ userId }: { userId: string }) {
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null)

  // Form state
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [relationship, setRelationship] = useState("Family")
  const [priority, setPriority] = useState("1")

  const { toast } = useToast()

  // Load contacts
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const userContacts = await db.getEmergencyContacts(userId)
        setContacts(userContacts)
      } catch (error) {
        console.error("Error loading contacts:", error)
        toast({
          title: "Error",
          description: "Failed to load emergency contacts",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadContacts()
  }, [userId, toast])

  const resetForm = () => {
    setName("")
    setPhone("")
    setRelationship("Family")
    setPriority("1")
    setEditingContact(null)
  }

  const handleOpenAddDialog = () => {
    resetForm()
    setShowAddDialog(true)
  }

  const handleOpenEditDialog = (contact: EmergencyContact) => {
    setName(contact.name)
    setPhone(contact.phone)
    setRelationship(contact.relationship)
    setPriority(contact.priority.toString())
    setEditingContact(contact)
    setShowAddDialog(true)
  }

  const handleSaveContact = async () => {
    try {
      if (!name || !phone) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      if (editingContact) {
        // Update existing contact
        const updatedContact = await db.updateEmergencyContact(editingContact.id, {
          userId,
          name,
          phone,
          relationship,
          priority: Number.parseInt(priority),
        })

        if (updatedContact) {
          setContacts(contacts.map((c) => (c.id === updatedContact.id ? updatedContact : c)))
          toast({
            title: "Contact updated",
            description: `${name} has been updated in your emergency contacts`,
          })
        }
      } else {
        // Add new contact
        const newContact = await db.addEmergencyContact({
          userId,
          name,
          phone,
          relationship,
          priority: Number.parseInt(priority),
        })

        setContacts([...contacts, newContact])
        toast({
          title: "Contact added",
          description: `${name} has been added to your emergency contacts`,
        })
      }

      setShowAddDialog(false)
      resetForm()
    } catch (error) {
      console.error("Error saving contact:", error)
      toast({
        title: "Error",
        description: "Failed to save emergency contact",
        variant: "destructive",
      })
    }
  }

  const handleDeleteContact = async (id: string) => {
    try {
      const success = await db.deleteEmergencyContact(id, userId)

      if (success) {
        setContacts(contacts.filter((c) => c.id !== id))
        toast({
          title: "Contact deleted",
          description: "Emergency contact has been removed",
        })
      }
    } catch (error) {
      console.error("Error deleting contact:", error)
      toast({
        title: "Error",
        description: "Failed to delete emergency contact",
        variant: "destructive",
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case "Family":
        return "bg-saheli-teal/20 text-saheli-teal border-saheli-teal/30"
      case "Friend":
        return "bg-saheli-purple/20 text-saheli-purple border-saheli-purple/30"
      case "Emergency Service":
        return "bg-saheli-pink/20 text-saheli-pink border-saheli-pink/30"
      case "Colleague":
        return "bg-saheli-orange/20 text-saheli-orange border-saheli-orange/30"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-24 w-full max-w-md bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Button
        className="w-full sm:w-auto bg-gradient-to-r from-saheli-pink to-saheli-orange text-white hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-md"
        onClick={handleOpenAddDialog}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Contact
      </Button>

      {contacts.length === 0 ? (
        <div className="text-center py-8 border rounded-lg animate-fade-in dark:border-gray-700">
          <p className="text-muted-foreground mb-4">No emergency contacts added yet.</p>
          <Button
            variant="outline"
            onClick={handleOpenAddDialog}
            className="hover:border-saheli-pink hover:text-saheli-pink transition-all duration-300"
          >
            Add Your First Contact
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts
            .sort((a, b) => a.priority - b.priority)
            .map((contact, index) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-all duration-300 animate-fade-in card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3 bg-gradient-to-br from-saheli-pink to-saheli-orange text-white">
                    <AvatarImage
                      src={`/placeholder.svg?height=40&width=40&text=${getInitials(contact.name)}`}
                      alt={contact.name}
                    />
                    <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium text-foreground">{contact.name}</p>
                      <Badge variant="outline" className={`ml-2 text-xs ${getRelationshipColor(contact.relationship)}`}>
                        {contact.relationship}
                      </Badge>
                      {contact.priority === 1 && (
                        <Badge className="ml-2 text-xs bg-saheli-pink text-white">Primary</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      // In a real app, this would initiate a phone call
                      toast({
                        title: "Calling contact",
                        description: `Initiating call to ${contact.name}`,
                      })
                    }}
                    className="text-saheli-pink hover:bg-saheli-pink/10 hover:scale-110 transition-all duration-300"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenEditDialog(contact)}
                    className="hover:bg-saheli-teal/10 hover:text-saheli-teal hover:scale-110 transition-all duration-300"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteContact(contact.id)}
                    className="hover:bg-saheli-pink/10 hover:text-saheli-pink hover:scale-110 transition-all duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="dialog-content dark:bg-gray-800 dark:text-white">
          <DialogHeader>
            <DialogTitle>{editingContact ? "Edit Contact" : "Add Emergency Contact"}</DialogTitle>
            <DialogDescription className="dark:text-gray-300">
              {editingContact
                ? "Update the details of your emergency contact."
                : "Add someone who should be contacted in case of an emergency."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contact's full name"
                required
                className="border-saheli-pink/20 focus:border-saheli-pink dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
                className="border-saheli-pink/20 focus:border-saheli-pink dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Select value={relationship} onValueChange={setRelationship}>
                <SelectTrigger
                  id="relationship"
                  className="border-saheli-pink/20 focus:border-saheli-pink dark:bg-gray-700 dark:border-gray-600"
                >
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800">
                  <SelectItem value="Family">Family</SelectItem>
                  <SelectItem value="Friend">Friend</SelectItem>
                  <SelectItem value="Colleague">Colleague</SelectItem>
                  <SelectItem value="Emergency Service">Emergency Service</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger
                  id="priority"
                  className="border-saheli-pink/20 focus:border-saheli-pink dark:bg-gray-700 dark:border-gray-600"
                >
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800">
                  <SelectItem value="1">Primary (First to be contacted)</SelectItem>
                  <SelectItem value="2">Secondary</SelectItem>
                  <SelectItem value="3">Tertiary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false)
                resetForm()
              }}
              className="hover:border-saheli-pink hover:text-saheli-pink transition-all duration-300 dark:border-gray-600 dark:hover:border-saheli-pink"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-saheli-pink to-saheli-orange text-white hover:opacity-90 transition-all duration-300"
              onClick={handleSaveContact}
            >
              <Save className="h-4 w-4 mr-2" />
              {editingContact ? "Update Contact" : "Save Contact"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

