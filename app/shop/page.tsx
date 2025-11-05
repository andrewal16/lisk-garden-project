"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Coins, Droplet, Flame, Sparkles, ShoppingCart, ArrowLeft } from "lucide-react"
import { usePlants } from "@/hooks/usePlants"
import { useContract } from "@/hooks/useContract"
import { ItemType, ETH_ENTRY_FEE, INITIAL_GDN_GIVEAWAY, PLANT_NFT_COST, WATER_COST, FERTILIZER_COST } from "@/types/contracts"
import Link from "next/link"

export default function ShopPage() {
  const { plants, gdnBalance, buyGdn, buyPlantNft, useItem, loading } = usePlants()
  const { isConnected } = useContract()
  const [selectedPlantId, setSelectedPlantId] = useState<bigint | null>(null)

  const gdnBalanceNum = parseFloat(gdnBalance)
  const canBuyPlant = gdnBalanceNum >= parseFloat(PLANT_NFT_COST)

  const handleBuyGdn = async () => {
    await buyGdn()
  }

  const handleBuyPlant = async () => {
    await buyPlantNft()
  }

  const handleBuyWater = async () => {
    if (!selectedPlantId) return
    await useItem(selectedPlantId, ItemType.WATER)
    setSelectedPlantId(null)
  }

  const handleBuyFertilizer = async () => {
    if (!selectedPlantId) return
    await useItem(selectedPlantId, ItemType.FERTILIZER)
    setSelectedPlantId(null)
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="outline" className="mb-6 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Garden
            </Button>
          </Link>
          <Card className="p-12 text-center border-2 border-dashed border-primary/30">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-primary/50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground">
              Please connect your wallet to access the shop
            </p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/">
              <Button variant="outline" className="mb-4 gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Garden
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-foreground">🛒 Garden Shop</h1>
            <p className="text-muted-foreground mt-2">Buy GDN, plants, and items to grow your garden</p>
          </div>
          <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/30">
            <div className="flex items-center gap-2 mb-1">
              <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-muted-foreground">Your Balance</span>
            </div>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {gdnBalanceNum.toFixed(2)} GDN
            </p>
          </Card>
        </div>

        {/* Shop Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buy GDN */}
          <Card className="p-6 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border-2 border-amber-500/30 hover:border-amber-500/50 transition-all">
            <div className="text-center space-y-4">
              <div className="text-6xl mb-2">💰</div>
              <h3 className="text-2xl font-bold text-foreground">Buy GDN Tokens</h3>
              <p className="text-sm text-muted-foreground">
                Purchase Garden Tokens to use in the game
              </p>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Cost</span>
                  <span className="font-bold text-lg">{ETH_ENTRY_FEE} ETH</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-semibold">You get: {INITIAL_GDN_GIVEAWAY} GDN</span>
                </div>
              </div>

              <Button
                onClick={handleBuyGdn}
                disabled={loading}
                className="w-full gap-2 bg-amber-600 hover:bg-amber-700 text-white h-12 text-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Coins className="w-5 h-5" />
                    Buy {INITIAL_GDN_GIVEAWAY} GDN
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Buy Plant NFT */}
          <Card className={`p-6 border-2 transition-all ${
            canBuyPlant 
              ? 'bg-gradient-to-br from-primary/5 to-accent/5 border-primary/30 hover:border-primary/50' 
              : 'bg-muted/10 border-muted opacity-60'
          }`}>
            <div className="text-center space-y-4">
              <div className="text-6xl mb-2">🌱</div>
              <h3 className="text-2xl font-bold text-foreground">Buy Plant NFT</h3>
              <p className="text-sm text-muted-foreground">
                Get a unique plant NFT to start growing
              </p>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Cost</span>
                  <span className="font-bold text-lg text-primary">{PLANT_NFT_COST} GDN</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  ERC-721 NFT • Reusable • Infinite Cycles
                </div>
              </div>

              <Button
                onClick={handleBuyPlant}
                disabled={loading || !canBuyPlant}
                className="w-full gap-2 bg-primary hover:bg-primary/90 h-12 text-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Buy Plant NFT
                  </>
                )}
              </Button>

              {!canBuyPlant && (
                <p className="text-sm text-destructive">
                  Need {parseFloat(PLANT_NFT_COST) - gdnBalanceNum} more GDN
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Items Section */}
        {plants.length > 0 && (
          <>
            <div className="pt-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Buy Items for Your Plants</h2>
              <p className="text-muted-foreground mb-4">
                Select a plant below, then choose an item to use
              </p>
            </div>

            {/* Plant Selector */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {plants.map((plant) => (
                <Card
                  key={plant.id.toString()}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedPlantId === plant.id
                      ? 'border-2 border-primary bg-primary/5'
                      : 'border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedPlantId(plant.id)}
                >
                  <div className="text-center space-y-2">
                    <div className="text-3xl">
                      {plant.progress >= 100 ? '🌸' : plant.progress >= 60 ? '🪴' : plant.progress >= 30 ? '🌿' : '🌱'}
                    </div>
                    <p className="text-sm font-semibold">Plant #{plant.id.toString()}</p>
                    <Progress value={plant.progress} className="h-1" />
                    <p className="text-xs text-muted-foreground">{plant.progress}%</p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Water */}
              <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-2 border-blue-500/30 hover:border-blue-500/50 transition-all">
                <div className="text-center space-y-4">
                  <div className="text-6xl mb-2">💧</div>
                  <h3 className="text-2xl font-bold text-foreground">Water</h3>
                  <p className="text-sm text-muted-foreground">
                    Increase plant progress by 15%
                  </p>
                  
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Cost</span>
                      <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{WATER_COST} GDN</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      +15% Progress • Max 2 per cycle
                    </div>
                  </div>

                  <Button
                    onClick={handleBuyWater}
                    disabled={loading || !selectedPlantId || gdnBalanceNum < parseFloat(WATER_COST)}
                    className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Droplet className="w-5 h-5" />
                        {selectedPlantId ? `Use on Plant #${selectedPlantId}` : 'Select a Plant'}
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Fertilizer */}
              <Card className="p-6 bg-gradient-to-br from-orange-500/5 to-red-500/5 border-2 border-orange-500/30 hover:border-orange-500/50 transition-all">
                <div className="text-center space-y-4">
                  <div className="text-6xl mb-2">🔥</div>
                  <h3 className="text-2xl font-bold text-foreground">Fertilizer</h3>
                  <p className="text-sm text-muted-foreground">
                    Increase plant progress by 20%
                  </p>
                  
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Cost</span>
                      <span className="font-bold text-lg text-orange-600 dark:text-orange-400">{FERTILIZER_COST} GDN</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      +20% Progress • Max 2 per cycle
                    </div>
                  </div>

                  <Button
                    onClick={handleBuyFertilizer}
                    disabled={loading || !selectedPlantId || gdnBalanceNum < parseFloat(FERTILIZER_COST)}
                    className="w-full gap-2 bg-orange-600 hover:bg-orange-700 text-white h-12 text-lg"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Flame className="w-5 h-5" />
                        {selectedPlantId ? `Use on Plant #${selectedPlantId}` : 'Select a Plant'}
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* Info Card */}
        <Card className="p-6 bg-muted/30 border-primary/20">
          <h3 className="font-semibold text-foreground mb-3">💡 Shop Tips</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Buy GDN tokens first to purchase plants and items</p>
            <p>• Each plant NFT can be grown infinitely in cycles</p>
            <p>• Items have a 2-minute cycle limit (max 2 uses each)</p>
            <p>• Fertilizer gives more progress (+20%) than Water (+15%)</p>
            <p>• Claim 10 GDN reward when your plant reaches 100%</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
