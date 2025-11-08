"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Leaf, Sparkles, Coins, Clock, TrendingUp, Award, Zap, Info } from 'lucide-react'
import { motion } from 'framer-motion'
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
  const { isConnected } = useContract()

  const readyToClaimPlants = plants.filter((p) => p.progress >= 100).length
  const growingPlants = plants.filter((p) => p.progress < 100).length
  const totalProgress = plants.reduce((acc, p) => acc + p.progress, 0)
  const avgProgress = plants.length > 0 ? totalProgress / plants.length : 0

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <motion.div 
      className="space-y-4 sticky top-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* GDN Balance - Show only when connected */}
      {isConnected && (
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden p-6 border-3 border-amber-300/60 
            dark:border-amber-800/60 shadow-xl hover:shadow-2xl 
            transition-all duration-500 group rounded-2xl">
            
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-yellow-400/20 
                to-orange-400/20"
              animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% 200%' }}
            />
            
            <div className="relative z-10">
              <motion.h3 
                className="font-black text-foreground mb-4 flex items-center gap-2 font-cute text-xl"
                whileHover={{ scale: 1.05, x: 5 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Coins className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </motion.div>
                GDN Balance
              </motion.h3>
              
              <div className="text-center">
                <motion.p 
                  className="text-5xl font-black text-amber-600 dark:text-amber-400 
                    font-cute drop-shadow-lg"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {parseFloat(gdnBalance).toFixed(2)}
                </motion.p>
                <p className="text-sm text-muted-foreground font-cute mt-2 flex items-center 
                  justify-center gap-1.5 font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  Garden Tokens
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Garden Stats */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden p-6 backdrop-blur-xl 
          bg-white/80 dark:bg-gray-900/80 border-3 border-purple-300/60 
          dark:border-purple-800/60 shadow-xl hover:shadow-2xl 
          transition-all duration-500 rounded-2xl">
          
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent 
            to-pink-500/5 pointer-events-none" />
          
          <motion.h3 
            className="relative font-black text-foreground mb-4 flex items-center gap-2 
              font-cute text-xl"
            whileHover={{ scale: 1.05, x: 5 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Leaf className="w-6 h-6 text-primary" />
            </motion.div>
            Garden Stats
          </motion.h3>
          
          {isConnected ? (
            <div className="relative space-y-3">
              {/* Total Plants */}
              <motion.div 
                className="flex items-center justify-between p-3 rounded-xl 
                  bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 
                  hover:to-accent/20 transition-all duration-300"
                whileHover={{ scale: 1.03, x: 5 }}
              >
                <span className="flex items-center gap-2.5 text-sm text-muted-foreground 
                  font-cute font-semibold">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Leaf className="w-5 h-5 text-primary" />
                  </div>
                  Total Plants
                </span>
                <span className="font-black text-foreground text-2xl font-cute">
                  {plants.length}
                </span>
              </motion.div>

              {/* Ready to Claim */}
              <motion.div 
                className="flex items-center justify-between p-3 rounded-xl 
                  bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 
                  dark:to-amber-900/30 border-2 border-yellow-300/50 
                  dark:border-yellow-700/50 hover:from-yellow-200 hover:to-amber-200"
                whileHover={{ scale: 1.03, x: 5 }}
              >
                <span className="flex items-center gap-2.5 text-sm text-muted-foreground 
                  font-cute font-semibold">
                  <motion.div
                    className="p-2 rounded-lg bg-yellow-500/30"
                    animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </motion.div>
                  Ready to Claim
                </span>
                <motion.span 
                  className="font-black text-foreground text-2xl font-cute"
                  animate={readyToClaimPlants > 0 ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {readyToClaimPlants}
                </motion.span>
              </motion.div>

              {/* Growing Plants */}
              <motion.div 
                className="flex items-center justify-between p-3 rounded-xl 
                  bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 
                  dark:to-green-900/30 border-2 border-emerald-300/50 
                  dark:border-emerald-700/50 hover:from-emerald-200 hover:to-green-200"
                whileHover={{ scale: 1.03, x: 5 }}
              >
                <span className="flex items-center gap-2.5 text-sm text-muted-foreground 
                  font-cute font-semibold">
                  <motion.div
                    className="p-2 rounded-lg bg-emerald-500/30"
                    animate={{ y: [0, -5, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </motion.div>
                  Growing
                </span>
                <span className="font-black text-foreground text-2xl font-cute">
                  {growingPlants}
                </span>
              </motion.div>

              {/* Average Progress - Only show if there are plants */}
              {plants.length > 0 && (
                <motion.div 
                  className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 
                    dark:from-blue-900/30 dark:to-cyan-900/30 border-2 border-blue-300/50 
                    dark:border-blue-700/50 mt-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-cute font-semibold text-muted-foreground 
                      flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Average Progress
                    </span>
                    <span className="text-xl font-black text-blue-600 dark:text-blue-400 
                      font-cute">
                      {avgProgress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="relative h-3 bg-blue-200 dark:bg-blue-900 rounded-full 
                    overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 
                        to-cyan-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(avgProgress, 100)}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              )}

              {/* No Plants Message */}
              {plants.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 px-4 bg-gradient-to-br from-purple-100 to-pink-100 
                    dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border-2 
                    border-purple-300/50 dark:border-purple-700/50"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-5xl mb-3"
                  >
                    🌱
                  </motion.div>
                  <p className="text-sm font-cute font-bold text-muted-foreground">
                    No plants yet!
                  </p>
                  <p className="text-xs font-cute text-muted-foreground mt-1">
                    Plant your first seed to start 🚀
                  </p>
                </motion.div>
              )}
            </div>
          ) : (
            <p className="relative text-sm text-muted-foreground text-center py-6 
              font-cute bg-muted/30 rounded-lg font-semibold">
              Connect wallet to view stats 🔐
            </p>
          )}
        </Card>
      </motion.div>

      {/* Economy Info */}
      <motion.div variants={itemVariants}>
        <Card className="p-5 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 
          border-3 border-purple-300/60 dark:border-purple-800/60 shadow-xl 
          rounded-2xl">
          <motion.h3 
            className="font-black text-foreground mb-4 flex items-center gap-2 
              font-cute text-lg"
            whileHover={{ scale: 1.05 }}
          >
            <Coins className="w-5 h-5 text-amber-500" />
            Economy
          </motion.h3>
          
          <div className="space-y-2 text-xs">
            {[
              { label: "Buy GDN", value: `${ETH_ENTRY_FEE} ETH → ${INITIAL_GDN_GIVEAWAY} GDN`, icon: "💰" },
              { label: "Plant NFT", value: `${PLANT_NFT_COST} GDN`, icon: "🌱" },
              { label: "Water", value: `${WATER_COST} GDN (+15%)`, icon: "💧" },
              { label: "Fertilizer", value: `${FERTILIZER_COST} GDN (+20%)`, icon: "🔥" },
              { label: "Reward", value: `${REWARD_GDN_AMOUNT} GDN`, icon: "🎁" },
            ].map((item, i) => (
              <motion.div 
                key={i}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 5 }}
              >
                <span className="flex items-center gap-2 font-cute font-semibold text-muted-foreground">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </span>
                <span className="font-black text-foreground font-cute text-xs">
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* How to Play + Cycle System - COMBINED */}
      <motion.div variants={itemVariants}>
        <Card className="p-5 backdrop-blur-xl bg-gradient-to-br from-purple-50 to-pink-50 
          dark:from-purple-900/20 dark:to-pink-900/20 border-3 border-purple-300/60 
          dark:border-purple-700/60 shadow-xl rounded-2xl overflow-hidden relative">
          
          {/* Decorative background animation */}
          <motion.div
            className="absolute inset-0 opacity-10 dark:opacity-5"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ 
              backgroundImage: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />
          
          {/* Game Guide */}
          <motion.div 
            className="mb-5 pb-5 border-b-2 border-purple-200 dark:border-purple-800/50 relative"
            whileHover={{ scale: 1.01 }}
          >
            <motion.h3 
              className="font-black text-foreground mb-4 font-cute text-lg 
                flex items-center gap-2"
              whileHover={{ x: 3 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Info className="w-5 h-5 text-purple-500" />
              </motion.div>
              Game Guide
            </motion.h3>
            
            <div className="space-y-2 text-xs text-muted-foreground font-cute font-semibold">
              {[
                { step: "1. Buy GDN with ETH to start", icon: "💰", color: "amber" },
                { step: "2. Purchase your Plant NFT", icon: "🌱", color: "green" },
                { step: "3. Use items to boost growth", icon: "🚀", color: "blue" },
                { step: "4. Claim rewards at 100%", icon: "🎁", color: "purple" },
                { step: "5. Infinite reusable cycles!", icon: "🔄", color: "pink" },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r 
                    from-${item.color}-50 to-${item.color}-100 
                    dark:from-${item.color}-900/20 dark:to-${item.color}-900/30
                    border border-${item.color}-200/50 dark:border-${item.color}-800/50
                    shadow-sm`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ 
                    x: 5, 
                    scale: 1.02,
                    boxShadow: "0 4px 12px rgba(147, 51, 234, 0.15)"
                  }}
                >
                  <motion.span 
                    className="text-2xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  >
                    {item.icon}
                  </motion.span>
                  <span className="text-xs font-semibold">{item.step}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Cycle System */}
          <motion.div whileHover={{ scale: 1.01 }} className="relative">
            <motion.h3 
              className="font-black text-foreground mb-4 flex items-center gap-2 
                font-cute text-lg"
              whileHover={{ x: 3 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="w-5 h-5 text-orange-500" />
              </motion.div>
              Cycle System
            </motion.h3>
            
            <div className="space-y-3">
              {/* Reset Cycle Info */}
              <motion.div 
                className="p-4 rounded-xl bg-gradient-to-r from-orange-100 to-amber-100 
                  dark:from-orange-900/30 dark:to-amber-900/30 border-2 border-orange-300/60 
                  dark:border-orange-700/60 shadow-md"
                whileHover={{ scale: 1.03, y: -2 }}
                animate={{ 
                  boxShadow: [
                    '0 0 0 0 rgba(249, 115, 22, 0)',
                    '0 0 0 8px rgba(249, 115, 22, 0.1)',
                    '0 0 0 0 rgba(249, 115, 22, 0)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </motion.div>
                  <span className="font-black text-foreground font-cute text-base">
                    {RESET_INTERVAL / 60} min reset cycle
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-cute font-semibold pl-8">
                  Each item: max 2 uses • Auto-resets ⏰
                </p>
              </motion.div>
              
              {/* Help Friends */}
              <motion.div 
                className="p-4 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 
                  dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-300/60 
                  dark:border-green-700/60 shadow-md relative overflow-hidden"
                whileHover={{ scale: 1.03, y: -2 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                
                <div className="flex items-center gap-3 relative z-10">
                  <motion.span 
                    className="text-3xl"
                    animate={{ rotate: [0, 20, -20, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🤝
                  </motion.span>
                  <div>
                    <p className="font-black text-foreground font-cute text-base mb-1">
                      Help Friends FREE!
                    </p>
                    <p className="text-xs text-muted-foreground font-cute font-semibold">
                      Care for others → +1% boost • No cost! 💚
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Pro Tip */}
              <motion.div 
                className="p-3 rounded-xl bg-gradient-to-r from-purple-100/80 to-pink-100/80 
                  dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-300/40 
                  dark:border-purple-700/40"
                whileHover={{ scale: 1.02 }}
                animate={{
                  borderColor: [
                    'rgba(147, 51, 234, 0.4)',
                    'rgba(236, 72, 153, 0.4)',
                    'rgba(147, 51, 234, 0.4)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <p className="text-[11px] text-muted-foreground font-cute font-semibold leading-relaxed">
                  💡 <strong className="text-purple-600 dark:text-purple-400">Pro Tip:</strong> Use items strategically! 
                  Max 2 water + 2 fertilizer per cycle. Help friends anytime for free boosts! 🚀
                </p>
              </motion.div>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </motion.div>
  )
}