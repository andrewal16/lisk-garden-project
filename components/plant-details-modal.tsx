"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Droplet, Sparkles, Flame, Coins, Users, Clock, Star, Heart } from "lucide-react"
import { Plant, ItemType, WATER_COST, FERTILIZER_COST, REWARD_GDN_AMOUNT } from "@/types/contracts"
import { usePlants } from "@/hooks/usePlants"
import { useContract } from "@/hooks/useContract"
import { formatTimeRemaining, canUseWater, canUseFertilizer, canClaimReward } from "@/lib/contract"
import { motion } from "framer-motion"
import { useMemo } from "react"
import confetti from "canvas-confetti"

const PROGRESS_COLORS = {
  low: "from-rose-300 via-pink-300 to-fuchsia-300",
  medium: "from-amber-300 via-yellow-300 to-orange-300",
  high: "from-emerald-300 via-teal-300 to-cyan-300",
  complete: "from-violet-300 via-purple-300 to-pink-300",
}

function getProgressLevel(progress: number) {
  if (progress >= 100) return 'complete'
  if (progress >= 60) return 'high'
  if (progress >= 30) return 'medium'
  return 'low'
}

interface PlantDetailsModalProps {
  plant: Plant | null
  isOpen: boolean
  onClose: () => void
}

export default function PlantDetailsModal({ plant, isOpen, onClose }: PlantDetailsModalProps) {
  const { useItem, claimReward, careForOtherPlant, loading } = usePlants()
  const { address } = useContract()

  const sparklePositions = useMemo(() => [
    { top: 10, left: 15 },
    { top: 20, left: 75 },
    { top: 45, left: 20 },
    { top: 60, left: 80 },
    { top: 30, left: 50 },
    { top: 70, left: 35 },
  ], [])

  if (!plant) return null

  const progressLevel = getProgressLevel(plant.progress)
  const canWater = canUseWater(plant)
  const canFertilize = canUseFertilizer(plant)
  const canClaim = canClaimReward(plant)
  const isOwnPlant = address?.toLowerCase() === plant.owner.toLowerCase()

  const handleUseWater = async () => {
    await useItem(plant.id, ItemType.WATER)
  }

  const triggerConfetti = () => {
    const duration = 3000
    const end = Date.now() + duration
    const colors = ['#FFE5EC', '#E0F4FF', '#D4F4DD', '#FFF9DB', '#F0E5FF']

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    
    frame()
  }

  const handleUseFertilizer = async () => {
    await useItem(plant.id, ItemType.FERTILIZER)
  }

  const handleClaimReward = async () => {
    await claimReward(plant.id)
    triggerConfetti()
    onClose()
  }

  const handleCareForOther = async () => {
    await careForOtherPlant(plant.id)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-gradient-to-br from-white/95 via-purple-50/95 to-pink-50/95 
        dark:from-gray-900/95 dark:via-purple-950/95 dark:to-pink-950/95 
        backdrop-blur-xl border-2 border-purple-200/50 dark:border-purple-800/50 
        rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-black">
            <motion.span 
              className="text-4xl"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {plant.progress >= 100 ? '🌸' : plant.progress >= 60 ? '🪴' : plant.progress >= 30 ? '🌿' : '🌱'}
            </motion.span>
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 
              bg-clip-text text-transparent">
              Plant #{plant.id.toString()}
            </span>
            {plant.progress >= 100 && (
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                👑
              </motion.span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* Plant Visualization */}
          <motion.div 
            className={`h-48 rounded-3xl flex items-center justify-center relative overflow-hidden 
              bg-gradient-to-br ${PROGRESS_COLORS[progressLevel]} 
              shadow-xl border-2 border-white/30`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Animated Pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)',
                backgroundSize: '30px 30px'
              }}
            />

            {/* Glowing Orb */}
            <motion.div
              className="absolute w-32 h-32 rounded-full blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)'
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Plant */}
            <motion.div 
              className="text-8xl z-10 drop-shadow-2xl"
              animate={plant.progress >= 100 ? { 
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              } : {
                y: [0, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              {plant.progress >= 100 ? '🌸' : plant.progress >= 60 ? '🪴' : plant.progress >= 30 ? '🌿' : '🌱'}
            </motion.div>
            
            {/* Sparkles for completed plants */}
            {plant.progress >= 100 && (
              <>
                {sparklePositions.map((pos, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      top: `${pos.top}%`,
                      left: `${pos.left}%`,
                    }}
                    animate={{
                      scale: [0, 1.5, 0],
                      rotate: [0, 180, 360],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  >
                    <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>

          {/* Progress Section */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Growth Magic
              </span>
              <motion.span 
                className="text-xl font-bold text-foreground"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {plant.progress}%
              </motion.span>
            </div>
            
            <Progress 
              value={plant.progress} 
              className="h-4 rounded-full shadow-inner"
            />
            
            <motion.p 
              className="text-xs text-muted-foreground font-semibold text-center pt-1"
              whileHover={{ scale: 1.02 }}
            >
              {plant.progress >= 100 
                ? "🌸 Perfect! Time to harvest!"
                : plant.progress >= 60
                ? "🪴 Almost there! Keep going!"
                : plant.progress >= 30
                ? "🌿 Growing nicely!"
                : "🌱 Just started!"}
            </motion.p>
          </motion.div>

          {/* Item Stats - FIXED LAYOUT */}
          <div className="grid grid-cols-2 gap-3">
            {/* Water Card */}
            <motion.div 
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Card className="bg-gradient-to-br from-blue-100 to-cyan-100 
                dark:from-blue-900/30 dark:to-cyan-900/30 
                border-2 border-blue-300/50 shadow-md rounded-2xl overflow-hidden">
                <div className="p-4 space-y-2">
                  {/* Header */}
                  <div className="flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-sm font-bold">Water</span>
                  </div>
                  
                  {/* Count */}
                  <div className="flex justify-center">
                    <span className="inline-block px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-bold">
                      {plant.waterCountInCycle}/2
                    </span>
                  </div>
                  
                  {/* Timer */}
                  {plant.waterTimeRemaining > 0 && (
                    <div className="text-xs text-orange-600 dark:text-orange-400 flex items-center 
                      justify-center gap-1 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-lg font-semibold">
                      <Clock className="w-3 h-3" />
                      {formatTimeRemaining(plant.waterTimeRemaining)}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Fertilizer Card */}
            <motion.div 
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Card className="bg-gradient-to-br from-orange-100 to-red-100 
                dark:from-orange-900/30 dark:to-red-900/30 
                border-2 border-orange-300/50 shadow-md rounded-2xl overflow-hidden">
                <div className="p-4 space-y-2">
                  {/* Header */}
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                    <span className="text-sm font-bold">Fertilizer</span>
                  </div>
                  
                  {/* Count */}
                  <div className="flex justify-center">
                    <span className="inline-block px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-bold">
                      {plant.fertilizerCountInCycle}/2
                    </span>
                  </div>
                  
                  {/* Timer */}
                  {plant.fertilizerTimeRemaining > 0 && (
                    <div className="text-xs text-orange-600 dark:text-orange-400 flex items-center 
                      justify-center gap-1 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-lg font-semibold">
                      <Clock className="w-3 h-3" />
                      {formatTimeRemaining(plant.fertilizerTimeRemaining)}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Claim Reward */}
          {canClaim && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Card className="p-5 bg-gradient-to-br from-yellow-200 via-amber-200 to-orange-200 
                dark:from-yellow-900/40 dark:via-amber-900/40 dark:to-orange-900/40 
                border-2 border-yellow-400/60 shadow-xl rounded-2xl">
                <div className="text-center space-y-2">
                  <Sparkles className="w-10 h-10 text-yellow-600 mx-auto" />
                  <p className="font-bold text-base text-foreground">
                    ✨ Harvest Time! ✨
                  </p>
                  <p className="text-xs text-muted-foreground font-semibold">
                    Claim your reward!
                  </p>
                  <div className="flex items-center justify-center gap-2 font-bold text-2xl text-primary">
                    <Coins className="w-6 h-6" />
                    {REWARD_GDN_AMOUNT} GDN
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {!canClaim && (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleUseWater}
                  disabled={loading || !canWater || plant.progress >= 100}
                  className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 
                    hover:from-blue-600 hover:to-cyan-600 text-white font-bold 
                    rounded-xl py-5 shadow-md"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Droplet className="w-4 h-4" />
                      +15%
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleUseFertilizer}
                  disabled={loading || !canFertilize || plant.progress >= 100}
                  className="gap-2 bg-gradient-to-r from-orange-500 to-red-500 
                    hover:from-orange-600 hover:to-red-600 text-white font-bold 
                    rounded-xl py-5 shadow-md"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Flame className="w-4 h-4" />
                      +20%
                    </>
                  )}
                </Button>
              </div>
            )}

            {canClaim && (
              <Button
                onClick={handleClaimReward}
                disabled={loading}
                className="w-full gap-2 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 
                  hover:from-yellow-600 hover:via-amber-600 hover:to-orange-600 
                  text-white font-bold text-base py-6 rounded-xl shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Harvesting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Claim {REWARD_GDN_AMOUNT} GDN! 🎉
                  </>
                )}
              </Button>
            )}

            {!isOwnPlant && (
              <Button
                onClick={handleCareForOther}
                disabled={loading || plant.progress >= 100}
                variant="outline"
                className="w-full gap-2 border-2 border-emerald-300 bg-emerald-50 
                  hover:bg-emerald-100 dark:bg-emerald-900/20 
                  font-bold rounded-xl py-5 shadow-sm"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 dark:text-emerald-300">
                      Help This Plant 💚
                    </span>
                  </>
                )}
              </Button>
            )}

            <Button
              variant="outline"
              onClick={onClose}
              className="w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm 
                border-2 font-bold rounded-xl py-5 shadow-sm"
              disabled={loading}
            >
              Close
            </Button>
          </div>

          {/* Info Card */}
          <Card className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 
            dark:from-purple-900/30 dark:to-pink-900/30 
            border-2 border-purple-300/50 shadow-md rounded-2xl">
            <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
              💧 <strong>Water</strong>: {WATER_COST} GDN → +15%
              <br />
              🔥 <strong>Fertilizer</strong>: {FERTILIZER_COST} GDN → +20%
              <br />
              🤝 <strong>Help</strong>: FREE → +1%
              <br />
              ⏱️ <strong>Cycle</strong>: Max 2 uses • Resets every 2 min
            </p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}