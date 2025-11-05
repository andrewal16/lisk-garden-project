"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Users, Droplet, Flame, Sparkles, RefreshCw } from "lucide-react"
import { useFriendPlants } from "@/hooks/useFriendPlants"
import { usePlants } from "@/hooks/usePlants"
import { useContract } from "@/hooks/useContract"
import { ItemType } from "@/types/contracts"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function FriendGardenPage() {
  const params = useParams()
  const friendAddress = params.address as string
  const { plants: friendPlants, loading: friendLoading, fetchFriendPlants } = useFriendPlants(friendAddress)
  const { useItem, careForOtherPlant, loading: actionLoading } = usePlants()
  const { isConnected, address } = useContract()
  const { toast } = useToast()
  const [selectedPlantId, setSelectedPlantId] = useState<bigint | null>(null)

  const isOwnGarden = address?.toLowerCase() === friendAddress?.toLowerCase()

  const handleCareForPlant = async (plantId: bigint) => {
    await careForOtherPlant(plantId)
    await fetchFriendPlants(true)
    toast({
      title: "Plant helped!",
      description: "You gave this plant +1% progress for FREE! 🤝",
    })
  }

  const handleUseWater = async (plantId: bigint) => {
    await useItem(plantId, ItemType.WATER)
    await fetchFriendPlants(true)
  }

  const handleUseFertilizer = async (plantId: bigint) => {
    await useItem(plantId, ItemType.FERTILIZER)
    await fetchFriendPlants(true)
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="outline" className="mb-6 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to My Garden
            </Button>
          </Link>
          <Card className="p-12 text-center border-2 border-dashed border-primary/30">
            <Users className="w-16 h-16 mx-auto mb-4 text-primary/50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground">
              Please connect your wallet to visit friend's gardens
            </p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/">
              <Button variant="outline" className="mb-4 gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to My Garden
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <Users className="w-10 h-10 text-primary" />
              {isOwnGarden ? "Your Garden" : "Friend's Garden"}
            </h1>
            <p className="text-muted-foreground mt-2 font-mono text-sm">
              {friendAddress}
            </p>
          </div>
          <Button
            onClick={() => fetchFriendPlants()}
            disabled={friendLoading}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${friendLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Info Card */}
        {!isOwnGarden && (
          <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/30">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Help Your Friend!</h3>
                <p className="text-sm text-muted-foreground">
                  You can help any plant for <strong className="text-primary">FREE</strong> by giving it +1% progress.
                  Or use your own Water/Fertilizer items on their plants!
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Plants Grid */}
        {friendLoading && friendPlants.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading plants...</p>
          </Card>
        ) : friendPlants.length === 0 ? (
          <Card className="p-12 text-center border-2 border-dashed border-primary/30">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Plants Yet</h3>
            <p className="text-muted-foreground">
              {isOwnGarden 
                ? "You haven't planted anything yet. Visit the shop to get started!"
                : "This user hasn't planted anything yet."}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {friendPlants.map((plant) => (
              <Card
                key={plant.id.toString()}
                className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2"
              >
                {/* Plant Visual */}
                <div className={`h-48 flex items-center justify-center relative overflow-hidden ${
                  plant.progress >= 100 
                    ? 'bg-gradient-to-b from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950'
                    : plant.progress >= 60
                    ? 'bg-gradient-to-b from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950'
                    : plant.progress >= 30
                    ? 'bg-gradient-to-b from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950'
                    : 'bg-gradient-to-b from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950'
                }`}>
                  <div className="text-7xl animate-float">
                    {plant.progress >= 100 ? '🌸' : plant.progress >= 60 ? '🪴' : plant.progress >= 30 ? '🌿' : '🌱'}
                  </div>
                  {plant.progress >= 100 && (
                    <div className="absolute top-3 right-3 animate-bounce">
                      <Sparkles className="w-6 h-6 text-yellow-500" />
                    </div>
                  )}
                </div>

                {/* Plant Info */}
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">Plant #{plant.id.toString()}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        plant.progress >= 100 
                          ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100'
                          : plant.progress >= 60
                          ? 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100'
                          : plant.progress >= 30
                          ? 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100'
                          : 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100'
                      }`}>
                        {plant.progress}% Growth
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{plant.progress}%</span>
                    </div>
                    <Progress value={plant.progress} className="h-2" />
                  </div>

                  {/* Actions */}
                  {!isOwnGarden && plant.progress < 100 && (
                    <div className="space-y-2 pt-2 border-t border-border">
                      <Button
                        onClick={() => handleCareForPlant(plant.id)}
                        disabled={actionLoading}
                        className="w-full gap-2 bg-primary hover:bg-primary/90"
                        size="sm"
                      >
                        {actionLoading ? (
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Users className="w-4 h-4" />
                            Help Plant (+1% FREE)
                          </>
                        )}
                      </Button>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => handleUseWater(plant.id)}
                          disabled={actionLoading}
                          variant="outline"
                          className="gap-1 text-xs"
                          size="sm"
                        >
                          <Droplet className="w-3 h-3" />
                          Water
                        </Button>
                        <Button
                          onClick={() => handleUseFertilizer(plant.id)}
                          disabled={actionLoading}
                          variant="outline"
                          className="gap-1 text-xs"
                          size="sm"
                        >
                          <Flame className="w-3 h-3" />
                          Fertilizer
                        </Button>
                      </div>
                    </div>
                  )}

                  {plant.progress >= 100 && (
                    <div className="text-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                        🌸 Fully Grown!
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
