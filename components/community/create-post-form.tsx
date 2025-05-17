"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Image, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface CreatePostFormProps {
  onCancel: () => void
}

export function CreatePostForm({ onCancel }: CreatePostFormProps) {
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [loading, setLoading] = useState(false)

  const { toast } = useToast()

  const handleAddTag = () => {
    if (!tagInput.trim()) return

    // Remove # if present and convert to lowercase
    const formattedTag = tagInput.trim().replace(/^#/, "").toLowerCase()

    if (formattedTag && !tags.includes(formattedTag)) {
      setTags([...tags, formattedTag])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleAddImage = () => {
    // In a real app, this would open a file picker
    // For demo purposes, we'll just add a placeholder
    if (images.length < 4) {
      setImages([...images, `/placeholder.svg?height=300&width=500&text=Image ${images.length + 1}`])
    } else {
      toast({
        title: "Maximum images reached",
        description: "You can only add up to 4 images per post",
        variant: "destructive",
      })
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: "Post content required",
        description: "Please enter some content for your post",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // In a real app, this would call an API to create the post
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Post created",
        description: "Your post has been published successfully!",
      })

      // Reset form and close
      setContent("")
      setImages([])
      setTags([])
      onCancel()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="What's on your mind?"
        className="min-h-[120px] resize-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      {images.length > 0 && (
        <div className={`grid ${images.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-2`}>
          {images.map((image, index) => (
            <div key={index} className="relative rounded-md overflow-hidden">
              <img
                src={image || "/placeholder.svg"}
                alt={`Upload preview ${index + 1}`}
                className="w-full h-auto object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 rounded-full"
                type="button"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-saheli-coral/10 text-saheli-darkred hover:bg-saheli-coral/20"
            >
              #{tag}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                type="button"
                onClick={() => handleRemoveTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Add tags (e.g., safety, travel)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddTag()
              }
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
            onClick={handleAddTag}
            disabled={!tagInput.trim()}
          >
            Add
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 border-t">
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={handleAddImage} disabled={images.length >= 4}>
            <Image className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            className="bg-saheli-red hover:bg-saheli-darkred"
            disabled={loading || !content.trim()}
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </form>
  )
}

