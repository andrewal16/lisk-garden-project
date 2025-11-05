"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Droplet, Sparkles, Flame, Coins, Users, Clock } from "lucide-react"
import { Plant, ItemType, WATER_COST, FERTILIZER_COST, REWARD_GDN_AMOUNT } from "@/types/contracts"
import { usePlants } from "@/hooks/usePlants"
import { useContract } from "@/hooks/useContract"
import { formatTimeRemaining, canUseWater, canUseFertilizer, canClaimReward } from "@/lib/contract"

interface PlantDetailsModalProps {
  plant: Plant | null
  isOpen: boolean
  onClose: () => void
}

export default function PlantDetailsModal({ plant, isOpen, onClose }: PlantDetailsModalProps) {
  const { useItem, claimReward, careForOtherPlant, loading } = usePlants()
  const { address } = useContract()

  if (!plant) return null

  const canWater = canUseWater(plant)
  const canFertilize = canUseFertilizer(plant)
  const canClaim = canClaimReward(plant)
  const isOwnPlant = address?.toLowerCase() === plant.owner.toLowerCase()

  const handleUseWater = async () => {
    await useItem(plant.id, ItemType.WATER)
  }

  const handleUseFertilizer = async () => {
    await useItem(plant.id, ItemType.FERTILIZER)
  }

  const handleClaimReward = async () => {
    await claimReward(plant.id)
    onClose()
  }

  const handleCareForOther = async () => {
    await careForOtherPlant(plant.id)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-3xl">
              {plant.progress >= 100 ? '🌸' : plant.progress >= 60 ? '🪴' : plant.progress >= 30 ? '🌿' : '🌱'}
            </span>
            Plant #{plant.id.toString()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plant visualization */}
          <div className={`h-40 rounded-lg flex items-center justify-center relative overflow-hidden ${
            plant.progress >= 100 
              ? 'bg-gradient-to-b from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950'
              : plant.progress >= 60
              ? 'bg-gradient-to-b from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950'
              : plant.progress >= 30
              ? 'bg-gradient-to-b from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950'
              : 'bg-gradient-to-b from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950'
          }`}>
            <div className="text-8xl animate-float">
              {plant.progress >= 100 ? '🌸' : plant.progress >= 60 ? '🪴' : plant.progress >= 30 ? '🌿' : '🌱'}
            </div>
            {plant.progress >= 100 && (
              <>
                <div className="absolute top-3 right-3 animate-bounce">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="absolute top-6 left-6 text-3xl animate-pulse">✨</div>
              </>
            )}
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                Growth Progress
              </span>
              <span className="text-sm font-semibold text-foreground">{plant.progress}%</span>
            </div>
            <Progress value={plant.progress} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {plant.progress >= 100 
                ? "🌸 Fully grown! Claim your reward!"
                : plant.progress >= 60
                ? "🪴 Almost there! Keep growing."
                : plant.progress >= 30
                ? "🌿 Growing well! Use items to speed up."
                : "🌱 Just started! Use Water and Fertilizer."}
            </p>
          </div>

          {/* Item Usage Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 bg-blue-500/5 border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Droplet className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Water</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                Used: {plant.waterCountInCycle}/2
              </p>
              {plant.waterTimeRemaining > 0 && (
                <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimeRemaining(plant.waterTimeRemaining)}
                </p>
              )}
            </Card>

            <Card className="p-3 bg-orange-500/5 border-orange-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium">Fertilizer</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                Used: {plant.fertilizerCountInCycle}/2
              </p>
              {plant.fertilizerTimeRemaining > 0 && (
                <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimeRemaining(plant.fertilizerTimeRemaining)}
                </p>
              )}
            </Card>
          </div>

          {/* Claim Reward */}
          {canClaim && (
            <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-green-500/10 border-yellow-500/30">
              <div className="text-center space-y-2">
                <p className="font-semibold text-foreground flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Ready to Claim Reward!
                </p>
                <p className="text-sm text-muted-foreground">
                  Claim your reward and reset progress
                </p>
                <p className="flex items-center justify-center gap-2 font-bold text-lg text-primary">
                  <Coins className="w-5 h-5" />
                  {REWARD_GDN_AMOUNT} GDN
                </p>
              </div>
            </Card>
          )}

          {/* Action buttons */}
          <div className="space-y-2">
            {!canClaim && (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleUseWater}
                  disabled={loading || !canWater || plant.progress >= 100}
                  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Droplet className="w-4 h-4" />
                      Water (+15%)
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleUseFertilizer}
                  disabled={loading || !canFertilize || plant.progress >= 100}
                  className="gap-2 bg-orange-600 hover:bg-orange-700 text-white"
                  size="sm"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Flame className="w-4 h-4" />
                      Fertilizer (+20%)
                    </>
                  )}
                </Button>
              </div>
            )}

            {canClaim && (
              <Button
                onClick={handleClaimReward}
                disabled={loading}
                className="w-full gap-2 bg-gradient-to-r from-yellow-500 to-green-600 hover:from-yellow-600 hover:to-green-700 text-white"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Claiming...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Claim {REWARD_GDN_AMOUNT} GDN
                  </>
                )}
              </Button>
            )}

            {!isOwnPlant && (
              <Button
                onClick={handleCareForOther}
                disabled={loading || plant.progress >= 100}
                variant="outline"
                className="w-full gap-2"
                size="sm"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    Help This Plant
                  </>
                )}
              </Button>
            )}

            <Button
              variant="outline"
              onClick={onClose}
              className="w-full bg-transparent"
              disabled={loading}
            >
              Close
            </Button>
          </div>

          {/* Info */}
          <Card className="p-3 bg-muted/30 border-primary/20">
            <p className="text-xs text-muted-foreground">
              💧 <strong>Water</strong>: {WATER_COST} GDN, +15% progress
              <br />
              🔥 <strong>Fertilizer</strong>: {FERTILIZER_COST} GDN, +20% progress
              <br />
              🤝 <strong>Help Others</strong>: FREE, +1% to any plant
              <br />
              ⏱️ <strong>Cycle</strong>: Max 2 uses each, resets every 2 minutes
            </p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
