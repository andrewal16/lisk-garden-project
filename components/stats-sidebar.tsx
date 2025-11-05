"use client"

import { Card } from "@/components/ui/card"
import { Leaf, Sparkles, Coins, Clock } from "lucide-react"
import { usePlants } from "@/hooks/usePlants"
import { useContract } from "@/hooks/useContract"
import {
  ETH_ENTRY_FEE,
  INITIAL_GDN_GIVEAWAY,
  PLANT_NFT_COST,
  WATER_COST,
  FERTILIZER_COST,
  REWARD_GDN_AMOUNT,
  RESET_INTERVAL,
} from "@/types/contracts"

interface StatsSidebarProps {
  selectedPlantId: bigint | null
}

export default function StatsSidebar({ selectedPlantId }: StatsSidebarProps) {
  const { plants, gdnBalance } = usePlants()
  const { isConnected, address } = useContract()

  const readyToClaimPlants = plants.filter((p) => p.progress >= 100).length
  const growingPlants = plants.filter((p) => p.progress < 100).length

  return (
    <div className="space-y-4 sticky top-24">
      {/* GDN Balance */}
      {isConnected && (
        <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/30 animate-slide-in-up hover:shadow-lg transition-all duration-300 ease-out">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            GDN Balance
          </h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {parseFloat(gdnBalance).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Garden Tokens</p>
          </div>
        </Card>
      )}

      {/* Garden Stats */}
      <Card className="p-4 bg-gradient-to-br from-card to-card/50 border border-border animate-slide-in-up hover:shadow-lg transition-all duration-300 ease-out">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-primary" />
          Garden Stats
        </h3>
        {isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Leaf className="w-4 h-4 text-primary" />
                Total Plants (NFTs)
              </span>
              <span className="font-semibold text-foreground">{plants.length}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Ready to Claim
              </span>
              <span className="font-semibold text-foreground">{readyToClaimPlants}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Leaf className="w-4 h-4 text-emerald-500" />
                Growing
              </span>
              <span className="font-semibold text-foreground">{growingPlants}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Connect wallet to view stats</p>
        )}
      </Card>

      {/* Wallet Info */}
      {isConnected && (
        <Card
          className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
          style={{ animationDelay: "0.1s" }}
        >
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Coins className="w-5 h-5 text-accent" />
            Wallet
          </h3>
          <div className="space-y-2">
            <div className="p-2 rounded bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">Address</p>
              <p className="text-xs font-mono text-foreground truncate">{address}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Economy Info */}
      <Card
        className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.2s" }}
      >
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Economy
        </h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded bg-amber-500/10 border border-amber-500/20">
            <p className="text-xs text-muted-foreground mb-1">Buy GDN</p>
            <p className="font-semibold text-foreground">{ETH_ENTRY_FEE} ETH → {INITIAL_GDN_GIVEAWAY} GDN</p>
          </div>
          <div className="p-3 rounded bg-primary/10 border border-primary/20">
            <p className="text-xs text-muted-foreground mb-1">Plant NFT Cost</p>
            <p className="font-semibold text-foreground">{PLANT_NFT_COST} GDN</p>
          </div>
          <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-muted-foreground mb-1">Water Cost</p>
            <p className="font-semibold text-foreground">{WATER_COST} GDN (+15%)</p>
          </div>
          <div className="p-3 rounded bg-orange-500/10 border border-orange-500/20">
            <p className="text-xs text-muted-foreground mb-1">Fertilizer Cost</p>
            <p className="font-semibold text-foreground">{FERTILIZER_COST} GDN (+20%)</p>
          </div>
          <div className="p-3 rounded bg-green-500/10 border border-green-500/20">
            <p className="text-xs text-muted-foreground mb-1">Claim Reward</p>
            <p className="font-semibold text-foreground">{REWARD_GDN_AMOUNT} GDN (at 100%)</p>
          </div>
        </div>
      </Card>

      {/* How to Play */}
      <Card
        className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.3s" }}
      >
        <h3 className="font-semibold text-foreground mb-3">How to Play</h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>1. Buy GDN tokens ({ETH_ENTRY_FEE} ETH)</p>
          <p>2. Buy Plant NFT ({PLANT_NFT_COST} GDN)</p>
          <p>3. Use Water & Fertilizer to grow</p>
          <p>4. Claim {REWARD_GDN_AMOUNT} GDN at 100% progress</p>
          <p>5. Repeat cycle with same plant!</p>
          <p className="text-primary font-semibold pt-2">🤝 Help others for FREE (+1%)</p>
          <p className="text-orange-600 dark:text-orange-400 font-semibold pt-2">
            ⏱️ Max 2 uses per item per cycle
          </p>
        </div>
      </Card>

      {/* Game Mechanics */}
      <Card
        className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.4s" }}
      >
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Cycle System
        </h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded bg-orange-500/10 border border-orange-500/20">
            <p className="text-xs text-muted-foreground mb-1">Cycle Duration</p>
            <p className="font-semibold text-foreground">{RESET_INTERVAL / 60} minutes</p>
          </div>
          <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-muted-foreground mb-1">Max Uses Per Cycle</p>
            <p className="font-semibold text-foreground">{2} times each item</p>
          </div>
          <p className="text-xs text-muted-foreground">
            After {RESET_INTERVAL / 60} minutes, you can use items again!
          </p>
        </div>
      </Card>
    </div>
  )
}
