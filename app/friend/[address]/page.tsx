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
import { motion, AnimatePresence } from "framer-motion"
import { useMemo } from "react"

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

  // Fixed sparkle positions
  const sparklePositions = useMemo(() => [
    { top: 10, left: 15 },
    { top: 20, left: 75 },
    { top: 45, left: 20 },
    { top: 60, left: 80 },
    { top: 30, left: 50 },
    { top: 70, left: 35 },
    { top: 15, left: 60 },
    { top: 55, left: 85 },
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

    ;(function frame() {
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
    })()
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
        backdrop-blur-xl border-4 border-purple-200/50 dark:border-purple-800/50 
        rounded-3xl shadow-2xl">
        
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-3xl font-black font-cute">
            <motion.span 
              className="text-5xl"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }}
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

        <div className="space-y-6 mt-4">
          {/* Plant Visualization - MEGA CUTE */}
          <motion.div 
            className={`h-56 rounded-3xl flex items-center justify-center relative overflow-hidden 
              bg-gradient-to-br ${PROGRESS_COLORS[progressLevel]} 
              shadow-2xl border-4 border-white/30`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Animated Pattern */}
            <motion.div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)',
                backgroundSize: '35px 35px'
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Glowing Orb */}
            <motion.div
              className="absolute w-40 h-40 rounded-full blur-[70px]"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 70%)'
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 0.9, 0.6],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Plant */}
            <motion.div 
              className="text-9xl z-10 drop-shadow-2xl"
              animate={plant.progress >= 100 ? { 
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.12, 1]
              } : {
                y: [0, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
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
                    <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                  </motion.div>
                ))}

                {/* Floating Hearts */}
                <motion.div
                  className="absolute top-4 right-4"
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-8 h-8 text-rose-400 fill-rose-400" />
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Progress Section - CUTE */}
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-base font-black text-foreground font-cute">
                <Sparkles className="w-6 h-6 text-purple-500" />
                Growth Magic
              </span>
              <motion.span 
                className="text-2xl font-black text-foreground font-cute"
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {plant.progress}%
              </motion.span>
            </div>
            
            <div className="relative">
              <Progress 
                value={plant.progress} 
                className="h-5 rounded-full shadow-inner bg-gray-200 dark:bg-gray-700"
              />
              {plant.progress >= 100 && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${PROGRESS_COLORS[progressLevel]} 
                    rounded-full opacity-60`}
                  animate={{ 
                    x: ["-100%", "200%"],
                    opacity: [0, 0.6, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>
            
            <motion.p 
              className="text-sm text-muted-foreground font-cute font-semibold text-center"
              whileHover={{ scale: 1.05 }}
            >
              {plant.progress >= 100 
                ? "🌸 Perfect! Time to harvest!"
                : plant.progress >= 60
                ? "🪴 Almost there! Keep going!"
                : plant.progress >= 30
                ? "🌿 Growing nicely! Use items!"
                : "🌱 Just started! Add water & fertilizer!"}
            </motion.p>
          </motion.div>

          {/* Item Stats - CUTE CARDS */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Card className="p-5 bg-gradient-to-br from-blue-100 to-cyan-100 
                dark:from-blue-900/30 dark:to-cyan-900/30 
                border-3 border-blue-300/60 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Droplet className="w-6 h-6 text-blue-600" />
                  <span className="text-base font-black font-cute">Water</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2 font-cute font-bold">
                  Used: {plant.waterCountInCycle}/2
                </p>
                {plant.waterTimeRemaining > 0 && (
                  <motion.p 
                    className="text-xs text-orange-600 dark:text-orange-400 flex items-center 
                      gap-1 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-lg font-cute"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Clock className="w-4 h-4" />
                    {formatTimeRemaining(plant.waterTimeRemaining)}
                  </motion.p>
                )}
              </Card>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05, rotate: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Card className="p-5 bg-gradient-to-br from-orange-100 to-red-100 
                dark:from-orange-900/30 dark:to-red-900/30 
                border-3 border-orange-300/60 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-6 h-6 text-orange-600" />
                  <span className="text-base font-black font-cute">Fertilizer</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2 font-cute font-bold">
                  Used: {plant.fertilizerCountInCycle}/2
                </p>
                {plant.fertilizerTimeRemaining > 0 && (
                  <motion.p 
                    className="text-xs text-orange-600 dark:text-orange-400 flex items-center 
                      gap-1 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-lg font-cute"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Clock className="w-4 h-4" />
                    {formatTimeRemaining(plant.fertilizerTimeRemaining)}
                  </motion.p>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Claim Reward - SUPER CUTE */}
          {canClaim && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Card className="p-6 bg-gradient-to-br from-yellow-200 via-amber-200 to-orange-200 
                dark:from-yellow-900/40 dark:via-amber-900/40 dark:to-orange-900/40 
                border-4 border-yellow-400/60 shadow-2xl">
                <div className="text-center space-y-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Sparkles className="w-12 h-12 text-yellow-600 mx-auto fill-yellow-600" />
                  </motion.div>
                  <p className="font-black text-lg text-foreground flex items-center justify-center 
                    gap-2 font-cute">
                    ✨ Harvest Time! ✨
                  </p>
                  <p className="text-sm text-muted-foreground font-cute font-semibold">
                    Claim your reward and start a new cycle!
                  </p>
                  <motion.div 
                    className="flex items-center justify-center gap-3 font-black text-3xl 
                      text-primary font-cute"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Coins className="w-8 h-8" />
                    {REWARD_GDN_AMOUNT} GDN
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Action Buttons - CUTE */}
          <div className="space-y-3">
            {!canClaim && (
              <div className="grid grid-cols-2 gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleUseWater}
                    disabled={loading || !canWater || plant.progress >= 100}
                    className="w-full gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 
                      hover:from-blue-600 hover:to-cyan-600 text-white font-black 
                      rounded-xl py-6 shadow-lg font-cute"
                  >
                    {loading ? (
                      <motion.div 
                        className="w-5 h-5 border-3 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <>
                        <Droplet className="w-5 h-5" />
                        Water +15%
                      </>
                    )}
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleUseFertilizer}
                    disabled={loading || !canFertilize || plant.progress >= 100}
                    className="w-full gap-2 bg-gradient-to-r from-orange-500 to-red-500 
                      hover:from-orange-600 hover:to-red-600 text-white font-black 
                      rounded-xl py-6 shadow-lg font-cute"
                  >
                    {loading ? (
                      <motion.div 
                        className="w-5 h-5 border-3 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <>
                        <Flame className="w-5 h-5" />
                        Fertilizer +20%
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            )}

            {canClaim && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleClaimReward}
                  disabled={loading}
                  className="w-full gap-3 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 
                    hover:from-yellow-600 hover:via-amber-600 hover:to-orange-600 
                    text-white font-black text-lg py-7 rounded-xl shadow-2xl font-cute"
                >
                  {loading ? (
                    <>
                      <motion.div 
                        className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Harvesting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      Claim {REWARD_GDN_AMOUNT} GDN! 🎉
                    </>
                  )}
                </Button>
              </motion.div>
            )}

            {!isOwnPlant && (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={handleCareForOther}
                  disabled={loading || plant.progress >= 100}
                  variant="outline"
                  className="w-full gap-2 border-3 border-emerald-300 bg-emerald-50 
                    hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 
                    font-black rounded-xl py-6 shadow-lg font-cute"
                >
                  {loading ? (
                    <motion.div 
                      className="w-5 h-5 border-3 border-emerald-600 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <>
                      <Users className="w-5 h-5 text-emerald-600" />
                      <span className="text-emerald-700 dark:text-emerald-300">
                        Help This Plant 💚
                      </span>
                    </>
                  )}
                </Button>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm 
                  border-3 font-black rounded-xl py-6 shadow-md font-cute"
                disabled={loading}
              >
                Close
              </Button>
            </motion.div>
          </div>

          {/* Info Card - CUTE */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-5 bg-gradient-to-br from-purple-100 to-pink-100 
              dark:from-purple-900/30 dark:to-pink-900/30 
              border-3 border-purple-300/50 shadow-lg">
              <p className="text-xs text-muted-foreground leading-relaxed font-cute font-semibold">
                💧 <strong>Water</strong>: {WATER_COST} GDN → +15% 🌊
                <br />
                🔥 <strong>Fertilizer</strong>: {FERTILIZER_COST} GDN → +20% 🚀
                <br />
                🤝 <strong>Help Others</strong>: FREE → +1% 💚
                <br />
                ⏱️ <strong>Cycle</strong>: Max 2 uses each • Resets every 2 min ⚡
              </p>
            </Card>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}