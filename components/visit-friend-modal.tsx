"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface VisitFriendModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function VisitFriendModal({ isOpen, onClose }: VisitFriendModalProps) {
  const [friendAddress, setFriendAddress] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleVisit = () => {
    if (!friendAddress) {
      toast({
        title: "Address required",
        description: "Please enter a wallet address",
        variant: "destructive",
      })
      return
    }

    // Basic validation for Ethereum address
    if (!friendAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast({
        title: "Invalid address",
        description: "Please enter a valid Ethereum address",
        variant: "destructive",
      })
      return
    }

    router.push(`/friend/${friendAddress}`)
    onClose()
    setFriendAddress("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Visit Friend's Garden
          </DialogTitle>
          <DialogDescription>
            Enter your friend's wallet address to view and help their plants
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Wallet Address
            </label>
            <Input
              placeholder="0x..."
              value={friendAddress}
              onChange={(e) => setFriendAddress(e.target.value)}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Example: 0x1234567890123456789012345678901234567890
            </p>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-semibold text-sm text-foreground mb-2">What you can do:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• View all their plants and progress</li>
              <li>• Help any plant for FREE (+1% progress)</li>
              <li>• Use your own Water/Fertilizer on their plants</li>
              <li>• Support your friends' gardens!</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleVisit}
              className="flex-1 gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Visit Garden
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
