"use client"

import { Leaf, Coins, ShoppingCart, Users } from "lucide-react"
import { LoginButton, useActiveAccount, liskSepolia } from "panna-sdk"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface GardenHeaderProps {
  gdnBalance: string
  onVisitFriend?: () => void
}

export default function GardenHeader({ gdnBalance, onVisitFriend }: GardenHeaderProps) {
  const activeAccount = useActiveAccount()
  const isConnected = !!activeAccount

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 animate-slide-in-down">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Lisk Garden V2</h1>
            <p className="text-xs text-muted-foreground">NFT Garden Game</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isConnected && onVisitFriend && (
            <Button variant="outline" className="gap-2" onClick={onVisitFriend}>
              <Users className="w-4 h-4" />
              Visit Friend
            </Button>
          )}
          {isConnected && (
            <Link href="/shop">
              <Button variant="outline" className="gap-2">
                <ShoppingCart className="w-4 h-4" />
                Shop
              </Button>
            </Link>
          )}
          {isConnected && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-muted-foreground">GDN Balance</span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {parseFloat(gdnBalance).toFixed(2)} GDN
                </span>
              </div>
            </div>
          )}
          <LoginButton chain={liskSepolia} />
        </div>
      </div>
    </header>
  )
}
