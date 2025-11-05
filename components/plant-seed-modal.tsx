"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Coins, Leaf } from "lucide-react"
import { usePlants } from "@/hooks/usePlants"
import { ETH_ENTRY_FEE, INITIAL_GDN_GIVEAWAY, PLANT_NFT_COST } from "@/types/contracts"

interface PlantSeedModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PlantSeedModal({ isOpen, onClose }: PlantSeedModalProps) {
  const { buyGdn, buyPlantNft, loading, gdnBalance } = usePlants()

  const handleBuyGdn = async () => {
    await buyGdn()
  }

  const handleBuyPlant = async () => {
    await buyPlantNft()
    onClose()
  }

  const gdnBalanceNum = parseFloat(gdnBalance)
  const canBuyPlant = gdnBalanceNum >= parseFloat(PLANT_NFT_COST)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Get Your Plant NFT
          </DialogTitle>
          <DialogDescription>
            First buy GDN tokens, then purchase your plant NFT
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Step 1: Buy GDN */}
          <Card className="p-6 border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-yellow-500/5">
            <div className="text-center">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="font-bold text-xl text-foreground mb-2">Step 1: Buy GDN</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Purchase GDN tokens to use in the game
              </p>

              {/* Price */}
              <div className="bg-card border border-border rounded-lg p-3 mb-4">
                <p className="text-xs text-muted-foreground mb-1">Cost</p>
                <p className="flex items-center justify-center gap-2 font-bold text-lg text-amber-600 dark:text-amber-400">
                  <Coins className="w-5 h-5" />
                  {ETH_ENTRY_FEE} ETH
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  You get: {INITIAL_GDN_GIVEAWAY} GDN
                </p>
              </div>

              <Button
                onClick={handleBuyGdn}
                disabled={loading}
                className="w-full gap-2 bg-amber-600 hover:bg-amber-700 text-white"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Coins className="w-4 h-4" />
                    Buy {INITIAL_GDN_GIVEAWAY} GDN
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground mt-2">
                Your balance: {gdnBalanceNum.toFixed(2)} GDN
              </p>
            </div>
          </Card>

          {/* Step 2: Buy Plant NFT */}
          <Card className={`p-6 border-2 ${canBuyPlant ? 'border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5' : 'border-muted bg-muted/10 opacity-60'}`}>
            <div className="text-center">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="font-bold text-xl text-foreground mb-2">Step 2: Buy Plant NFT</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get your unique plant NFT to start growing
              </p>

              {/* Price */}
              <div className="bg-card border border-border rounded-lg p-3 mb-4">
                <p className="text-xs text-muted-foreground mb-1">Cost</p>
                <p className="flex items-center justify-center gap-2 font-bold text-lg text-primary">
                  <Leaf className="w-5 h-5" />
                  {PLANT_NFT_COST} GDN
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ERC-721 NFT • Reusable
                </p>
              </div>

              <Button
                onClick={handleBuyPlant}
                disabled={loading || !canBuyPlant}
                className="w-full gap-2 bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Buy Plant NFT
                  </>
                )}
              </Button>

              {!canBuyPlant && (
                <p className="text-xs text-destructive mt-2">
                  Need {parseFloat(PLANT_NFT_COST) - gdnBalanceNum} more GDN
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Info card */}
        <Card className="p-4 bg-muted/30 border-primary/20">
          <p className="text-xs text-muted-foreground">
            🌱 <strong>NFT-based</strong>: Each plant is a unique ERC-721 token you own
            <br />
            🔄 <strong>Reusable</strong>: Grow the same plant multiple times in cycles
            <br />
            💧 <strong>Use items</strong>: Water (+15%) and Fertilizer (+20%) to grow
            <br />
            🎁 <strong>Earn rewards</strong>: Get 10 GDN when progress reaches 100%
            <br />
            🤝 <strong>Help others</strong>: Care for other plants for FREE (+1%)
          </p>
        </Card>

        {/* Close button */}
        <div className="flex justify-end pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="bg-transparent"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
