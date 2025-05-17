"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Phone, User, Plus, AlertCircle, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EmergencyContact {
  _id: string
  name: string
  phone: string
  relationship?: string
  createdAt: string
  updatedAt: string
}

export function EmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newContact, setNewContact] = useState({ name: "", phone: "", relationship: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Fetch emergency contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/emergency-contacts')
        if (!response.ok) {
          throw new Error('Failed to fetch emergency contacts')
        }
        const data = await response.json()
        setContacts(data)
      } catch (err) {
        console.error('Error fetching emergency contacts:', err)
        setError('Failed to load emergency contacts')
      } finally {
        setLoading(false)
      }
    }
    
    fetchContacts()
  }, [])

  const handleAddContact = async () => {
    try {
      // Validate input
      if (!newContact.name || !newContact.phone) {
        setError("Name and phone are required fields")
        return
      }

      // Reset error
      setError(null)
      
      // Create contact
      const response = await fetch('/api/emergency-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact)
      })

      if (!response.ok) {
        throw new Error('Failed to add emergency contact')
      }

      // Get new contact from response
      const createdContact = await response.json()
      
      // Update state
      setContacts([...contacts, createdContact])
      
      // Reset form
      setNewContact({ name: "", phone: "", relationship: "" })
      
      // Close dialog
      setIsDialogOpen(false)
    } catch (err) {
      console.error('Error adding emergency contact:', err)
      setError('Failed to add emergency contact')
    }
  }

  const handleDeleteContact = async (id: string) => {
    try {
      const response = await fetch(`/api/emergency-contacts?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete emergency contact')
      }

      // Update state
      setContacts(contacts.filter(contact => contact._id !== id))
    } catch (err) {
      console.error('Error deleting emergency contact:', err)
      setError('Failed to delete contact')
    }
  }

  return (
    <Card className="border shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Emergency Contacts</CardTitle>
            <CardDescription>People to notify in case of emergency</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-saheli-rose hover:bg-saheli-rose/90 text-white">
                <Plus className="h-4 w-4 mr-1" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Emergency Contact</DialogTitle>
                <DialogDescription>Add a trusted person who can be contacted in emergency situations.</DialogDescription>
              </DialogHeader>
              {error && (
                <div className="bg-saheli-danger/10 p-3 rounded-md flex items-start gap-2 text-saheli-danger text-sm">
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
              <div className="space-y-4 py-3">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter contact name"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="Enter phone number"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input 
                    id="relationship" 
                    placeholder="E.g., Parent, Friend, Sibling"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="button" onClick={handleAddContact}>
                  Add Contact
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[240px] pr-4">
          {loading ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-saheli-rose mx-auto mb-2"></div>
              <p className="text-muted-foreground">Loading contacts...</p>
            </div>
          ) : error && contacts.length === 0 ? (
            <div className="text-center py-6">
              <AlertCircle className="h-10 w-10 text-saheli-danger mx-auto mb-2" />
              <p className="text-saheli-danger">{error}</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-6">
              <Info className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No emergency contacts added</p>
              <p className="text-xs text-muted-foreground mt-1">Add contacts who should be notified in emergencies</p>
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div key={contact._id} className="flex items-center justify-between p-3 rounded-md bg-muted/50 hover:bg-muted">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-saheli-light flex items-center justify-center">
                      <User className="h-4 w-4 text-saheli-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{contact.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{contact.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {contact.relationship && (
                      <Badge variant="outline" className="text-xs bg-saheli-light/20">
                        {contact.relationship}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full hover:bg-saheli-danger/10 hover:text-saheli-danger"
                      onClick={() => handleDeleteContact(contact._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

