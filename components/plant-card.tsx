"use client"

import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Sparkles, Clock, Droplet, Flame, Heart, Star, Coins, Loader2 } from 'lucide-react'

// Mock types - replace with your actual types
interface Plant {
  id: bigint
  owner: string
  progress: number
  waterCountInCycle: number
  fertilizerCountInCycle: number
  waterTimeRemaining: number
  fertilizerTimeRemaining: number
}

const PROGRESS_COLORS = {
  low: "from-rose-300 via-pink-300 to-fuchsia-300",
  medium: "from-amber-300 via-yellow-300 to-orange-300",
  high: "from-emerald-300 via-teal-300 to-cyan-300",
  complete: "from-violet-300 via-purple-300 to-pink-300",
}

const PROGRESS_GLOW = {
  low: "shadow-[0_0_20px_rgba(251,113,133,0.3)]",
  medium: "shadow-[0_0_20px_rgba(251,191,36,0.3)]",
  high: "shadow-[0_0_20px_rgba(52,211,153,0.3)]",
  complete: "shadow-[0_0_30px_rgba(167,139,250,0.4)]",
}

const CARD_BG = {
  low: "from-rose-50/90 via-pink-50/90 to-white/90",
  medium: "from-amber-50/90 via-yellow-50/90 to-white/90",
  high: "from-emerald-50/90 via-teal-50/90 to-white/90",
  complete: "from-violet-50/90 via-purple-50/90 to-white/90",
}

function getProgressLevel(progress: number): keyof typeof PROGRESS_COLORS {
  if (progress >= 100) return 'complete'
  if (progress >= 60) return 'high'
  if (progress >= 30) return 'medium'
  return 'low'
}

function formatTimeRemaining(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

interface PlantCardProps {
  plant: Plant
  onClaimReward?: (plantId: bigint) => Promise<void>
  isLoading?: boolean
}

export default function PlantCard({ plant, onClaimReward, isLoading = false }: PlantCardProps) {
  const progressLevel = getProgressLevel(plant.progress)
  const canUseWater = plant.waterCountInCycle < 2 && plant.waterTimeRemaining === 0
  const canUseFertilizer = plant.fertilizerCountInCycle < 2 && plant.fertilizerTimeRemaining === 0
  const isWaitingCooldown = !canUseWater && !canUseFertilizer && plant.progress < 100
  const [isLiked, setIsLiked] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [isClaimingReward, setIsClaimingReward] = useState(false)

  const sparklePositions = useMemo(() => [
    { top: 15, left: 20 },
    { top: 25, left: 80 },
    { top: 45, left: 15 },
    { top: 60, left: 75 },
    { top: 35, left: 50 },
    { top: 70, left: 30 },
  ], [])

  const handleClaimReward = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!onClaimReward || isClaimingReward) return
    
    setIsClaimingReward(true)
    try {
      await onClaimReward(plant.id)
    } finally {
      setIsClaimingReward(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 15,
        duration: 0.5 
      }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      onHoverStart={() => setShowParticles(true)}
      onHoverEnd={() => setShowParticles(false)}
    >
      <Card
        className={`overflow-hidden cursor-pointer group relative
          bg-gradient-to-br ${CARD_BG[progressLevel]}
          dark:from-gray-900/90 dark:via-gray-800/90 dark:to-gray-900/90
          backdrop-blur-xl
          border-2 rounded-3xl transition-all duration-300
          ${PROGRESS_GLOW[progressLevel]}
          hover:shadow-[0_0_40px_rgba(167,139,250,0.3)]`}
      >
        {/* Floating Particles */}
        {showParticles && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute pointer-events-none z-20"
                initial={{ x: "50%", y: "50%", opacity: 0, scale: 0 }}
                animate={{
                  x: `${50 + (i % 2 === 0 ? 1 : -1) * (30 + i * 10)}%`,
                  y: `${50 + (i % 3 === 0 ? 1 : -1) * (30 + i * 8)}%`,
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0],
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
          </>
        )}

        {/* Plant Visualization */}
        <motion.div 
          className={`h-56 flex items-center justify-center relative overflow-hidden
            bg-gradient-to-br ${PROGRESS_COLORS[progressLevel]}`}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Background Pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)',
              backgroundSize: '30px 30px'
            }}
          />

          {/* Glowing Orb */}
          <motion.div
            className="absolute w-32 h-32 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Main Plant */}
          {plant.progress >= 100 ? (
            <>
              <motion.div 
                className="text-8xl z-10 drop-shadow-2xl"
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 8, -8, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                🌸
              </motion.div>
              
              {sparklePositions.map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute pointer-events-none"
                  style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
                  animate={{
                    scale: [0, 1.5, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                >
                  <Star className="w-6 h-6 text-yellow-300 fill-yellow-300 drop-shadow-lg" />
                </motion.div>
              ))}
            </>
          ) : plant.progress >= 60 ? (
            <motion.div 
              className="text-8xl z-10 drop-shadow-2xl"
              animate={{ y: [0, -15, 0], rotate: [-3, 3, -3], scale: [1, 1.05, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              🪴
            </motion.div>
          ) : plant.progress >= 30 ? (
            <motion.div 
              className="text-8xl z-10 drop-shadow-xl"
              animate={{ y: [0, -10, 0], rotate: [-2, 2, -2], scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🌿
            </motion.div>
          ) : (
            <motion.div 
              className="text-8xl z-10 drop-shadow-lg"
              animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🌱
            </motion.div>
          )}

          {/* Like Button */}
          <motion.button
            className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-lg 
              ${isLiked ? 'bg-rose-500/90' : 'bg-white/80 dark:bg-gray-800/80'}
              opacity-0 group-hover:opacity-100 transition-all duration-300
              border ${isLiked ? 'border-rose-300' : 'border-white/50'}`}
            whileHover={{ scale: 1.2, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              setIsLiked(!isLiked)
            }}
          >
            <Heart className={`w-5 h-5 transition-all duration-300 
              ${isLiked ? 'fill-white text-white' : 'text-rose-500'}`} />
          </motion.button>
        </motion.div>

        {/* Info Section */}
        <div className="p-6 space-y-4 bg-gradient-to-b from-white/50 to-white/80 
          dark:from-gray-900/50 dark:to-gray-800/80 backdrop-blur-md">
          
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <motion.h3 
                className="font-bold text-foreground text-2xl flex items-center gap-2"
                whileHover={{ scale: 1.03, x: 4 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Plant #{plant.id.toString()}
                {plant.progress >= 100 && (
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
                  >
                    👑
                  </motion.span>
                )}
              </motion.h3>
              
              <div className="flex gap-2 mt-3 flex-wrap">
                <motion.span 
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold 
                    bg-gradient-to-r ${PROGRESS_COLORS[progressLevel]} 
                    text-white shadow-md border border-white/30`}
                  whileHover={{ scale: 1.05 }}
                >
                  {plant.progress}% 🌱
                </motion.span>
                
                {plant.progress >= 100 && (
                  <motion.span 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold 
                      bg-gradient-to-r from-yellow-400 to-orange-400 
                      text-white border border-white/30 shadow-md"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✨ Ready!
                  </motion.span>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-foreground font-semibold">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Growth
              </span>
              <motion.span 
                className="text-foreground font-bold text-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {plant.progress}%
              </motion.span>
            </div>
            
            <Progress 
              value={plant.progress} 
              className="h-3 rounded-full shadow-inner"
            />
          </motion.div>

          {/* Conditional Rendering: Show Claim button if 100% */}
          {plant.progress >= 100 ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Button
                onClick={handleClaimReward}
                disabled={isClaimingReward || isLoading}
                className="w-full gap-2 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 
                  hover:from-yellow-600 hover:via-amber-600 hover:to-orange-600 
                  text-white font-bold text-base py-6 rounded-2xl shadow-lg"
              >
                {isClaimingReward ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Claiming...
                  </>
                ) : (
                  <>
                    <Coins className="w-5 h-5" />
                    Claim 10 GDN! 🎉
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Item Cards - FIXED LAYOUT */}
              <div className="grid grid-cols-2 gap-3">
                {/* Water Card */}
                <motion.div 
                  className="relative rounded-2xl overflow-hidden
                    bg-gradient-to-br from-blue-100 to-cyan-100 
                    dark:from-blue-900/30 dark:to-cyan-900/30
                    border-2 border-blue-300/50 dark:border-blue-700/50
                    shadow-md hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -3 }}
                >
                  <div className="p-4 space-y-2">
                    {/* Header Row */}
                    <div className="flex items-center gap-2">
                      <Droplet className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                        Water
                      </span>
                    </div>
                    
                    {/* Count Badge */}
                    <div className="flex justify-center">
                      <motion.span 
                        className={`inline-block px-4 py-1 rounded-full text-sm font-bold shadow-sm
                          ${canUseWater 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'}`}
                        animate={canUseWater ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {plant.waterCountInCycle}/2
                      </motion.span>
                    </div>
                    
                    {/* Cooldown Timer */}
                    {plant.waterTimeRemaining > 0 && (
                      <motion.div 
                        className="text-xs text-orange-600 dark:text-orange-400 font-semibold
                          flex items-center justify-center gap-1 bg-orange-100 dark:bg-orange-900/30 
                          px-2 py-1 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Clock className="w-3 h-3" />
                        {formatTimeRemaining(plant.waterTimeRemaining)}
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Fertilizer Card */}
                <motion.div 
                  className="relative rounded-2xl overflow-hidden
                    bg-gradient-to-br from-orange-100 to-red-100 
                    dark:from-orange-900/30 dark:to-red-900/30
                    border-2 border-orange-300/50 dark:border-orange-700/50
                    shadow-md hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -3 }}
                >
                  <div className="p-4 space-y-2">
                    {/* Header Row */}
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                      <span className="text-sm font-bold text-orange-700 dark:text-orange-300">
                        Fertilizer
                      </span>
                    </div>
                    
                    {/* Count Badge */}
                    <div className="flex justify-center">
                      <motion.span 
                        className={`inline-block px-4 py-1 rounded-full text-sm font-bold shadow-sm
                          ${canUseFertilizer 
                            ? 'bg-orange-500 text-white' 
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'}`}
                        animate={canUseFertilizer ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      >
                        {plant.fertilizerCountInCycle}/2
                      </motion.span>
                    </div>
                    
                    {/* Cooldown Timer */}
                    {plant.fertilizerTimeRemaining > 0 && (
                      <motion.div 
                        className="text-xs text-orange-600 dark:text-orange-400 font-semibold
                          flex items-center justify-center gap-1 bg-orange-100 dark:bg-orange-900/30 
                          px-2 py-1 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Clock className="w-3 h-3" />
                        {formatTimeRemaining(plant.fertilizerTimeRemaining)}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Waiting for Cooldown Status */}
              {isWaitingCooldown && (
                <motion.div 
                  className="text-sm text-center py-3 px-4 rounded-2xl 
                    bg-gradient-to-r from-orange-200 to-red-200 dark:from-orange-900/40 
                    dark:to-red-900/40 text-orange-800 dark:text-orange-200
                    font-semibold shadow-md border-2 border-orange-300 dark:border-orange-700"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    ⏳ Waiting for cooldown...
                  </span>
                </motion.div>
              )}
            </>
          )}
        </div>
      </Card>
    </motion.div>
  )
}