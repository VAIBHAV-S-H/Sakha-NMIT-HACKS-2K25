import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Phone } from "lucide-react"

export function EmergencyContacts() {
  const contacts = [
    {
      id: 1,
      name: "Mom",
      phone: "+91 98765 43210",
      relationship: "Family",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Sneha (Roommate)",
      phone: "+91 87654 32109",
      relationship: "Friend",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Local Police",
      phone: "100",
      relationship: "Emergency Service",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <div className="space-y-4">
      <Button className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Add New Contact
      </Button>

      <div className="space-y-3">
        {contacts.map((contact) => (
          <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <p className="font-medium">{contact.name}</p>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {contact.relationship}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{contact.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

