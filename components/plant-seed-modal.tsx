"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Coins, Leaf, ArrowRight } from "lucide-react"
import { usePlants } from "@/hooks/usePlants"
import { ETH_ENTRY_FEE, INITIAL_GDN_GIVEAWAY, PLANT_NFT_COST } from "@/types/contracts"
import { motion } from "framer-motion"

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
      <DialogContent className="max-w-3xl bg-gradient-to-br from-white/95 via-purple-50/95 to-pink-50/95 
        dark:from-gray-900/95 dark:via-purple-950/95 dark:to-pink-950/95 
        backdrop-blur-xl border-2 border-purple-200/50 dark:border-purple-800/50 
        rounded-3xl shadow-2xl">
        
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-black">
            <Sparkles className="w-6 h-6 text-purple-500" />
            Get Your Plant NFT
          </DialogTitle>
          <DialogDescription className="text-sm">
            Follow these 2 simple steps to start your garden! 🌱
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {/* Step 1: Buy GDN */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden border-2 border-amber-300/50 
              bg-gradient-to-br from-amber-50/90 to-yellow-50/90 
              dark:from-amber-900/30 dark:to-yellow-900/30
              shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              
              {/* Step Badge */}
              <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-amber-500 
                text-white font-bold flex items-center justify-center text-sm shadow-md">
                1
              </div>

              <div className="p-6 pt-12 text-center space-y-4">
                {/* Emoji */}
                <motion.div 
                  className="text-6xl"
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💰
                </motion.div>

                {/* Title */}
                <div>
                  <h3 className="font-bold text-xl text-foreground mb-1">
                    Buy GDN Tokens
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Get game currency to use items
                  </p>
                </div>

                {/* Price Box */}
                <div className="bg-white/80 dark:bg-gray-900/50 border-2 border-amber-200 
                  dark:border-amber-800 rounded-xl p-4 space-y-2">
                  <p className="text-xs text-muted-foreground font-semibold">
                    You Pay
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Coins className="w-5 h-5 text-amber-600" />
                    <span className="font-bold text-xl text-amber-600 dark:text-amber-400">
                      {ETH_ENTRY_FEE} ETH
                    </span>
                  </div>
                  <div className="pt-2 border-t border-amber-200 dark:border-amber-800">
                    <p className="text-xs text-green-600 dark:text-green-400 font-bold">
                      ✅ You Get: {INITIAL_GDN_GIVEAWAY} GDN
                    </p>
                  </div>
                </div>

                {/* Balance */}
                <div className="text-xs text-muted-foreground font-semibold">
                  💰 Your Balance: <span className="font-bold text-amber-600">
                    {gdnBalanceNum.toFixed(2)} GDN
                  </span>
                </div>

                {/* Button */}
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={handleBuyGdn}
                    disabled={loading}
                    className="w-full gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 
                      hover:from-amber-600 hover:to-yellow-600 text-white font-bold 
                      rounded-xl py-5 shadow-lg"
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
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Arrow Connector - Hidden on mobile */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-8 h-8 text-purple-500" />
            </motion.div>
          </div>

          {/* Step 2: Buy Plant NFT */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className={`relative overflow-hidden border-2 
              ${canBuyPlant 
                ? 'border-green-300/50 bg-gradient-to-br from-green-50/90 to-emerald-50/90 dark:from-green-900/30 dark:to-emerald-900/30' 
                : 'border-gray-300 bg-gray-100/80 dark:bg-gray-800/50 opacity-70'}
              shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl`}>
              
              {/* Step Badge */}
              <div className={`absolute top-3 left-3 w-8 h-8 rounded-full 
                ${canBuyPlant ? 'bg-green-500' : 'bg-gray-400'} 
                text-white font-bold flex items-center justify-center text-sm shadow-md`}>
                2
              </div>

              {/* Lock Overlay */}
              {!canBuyPlant && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px] z-10">
                  <div className="text-4xl">🔒</div>
                </div>
              )}

              <div className="p-6 pt-12 text-center space-y-4">
                {/* Emoji */}
                <motion.div 
                  className="text-6xl"
                  animate={canBuyPlant ? { 
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🌱
                </motion.div>

                {/* Title */}
                <div>
                  <h3 className="font-bold text-xl text-foreground mb-1">
                    Buy Plant NFT
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Your unique plant to grow & earn
                  </p>
                </div>

                {/* Price Box */}
                <div className={`border-2 rounded-xl p-4 space-y-2
                  ${canBuyPlant 
                    ? 'bg-white/80 dark:bg-gray-900/50 border-green-200 dark:border-green-800' 
                    : 'bg-gray-200/50 dark:bg-gray-800/30 border-gray-300 dark:border-gray-700'}`}>
                  <p className="text-xs text-muted-foreground font-semibold">
                    Cost
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Leaf className={`w-5 h-5 ${canBuyPlant ? 'text-green-600' : 'text-gray-500'}`} />
                    <span className={`font-bold text-xl ${canBuyPlant ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                      {PLANT_NFT_COST} GDN
                    </span>
                  </div>
                  <div className="pt-2 border-t border-green-200 dark:border-green-800">
                    <p className="text-xs text-muted-foreground font-semibold">
                      ✨ ERC-721 NFT • Reusable Forever
                    </p>
                  </div>
                </div>

                {/* Status Message */}
                {!canBuyPlant && (
                  <div className="text-xs text-red-600 dark:text-red-400 font-bold bg-red-100 
                    dark:bg-red-900/30 rounded-lg px-3 py-2">
                    ⚠️ Need {(parseFloat(PLANT_NFT_COST) - gdnBalanceNum).toFixed(2)} more GDN
                  </div>
                )}

                {/* Button */}
                <motion.div 
                  whileHover={canBuyPlant ? { scale: 1.03 } : {}} 
                  whileTap={canBuyPlant ? { scale: 0.97 } : {}}
                >
                  <Button
                    onClick={handleBuyPlant}
                    disabled={loading || !canBuyPlant}
                    className={`w-full gap-2 font-bold rounded-xl py-5 shadow-lg
                      ${canBuyPlant 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white' 
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Buy Plant NFT
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Info Cards */}
        <div className="space-y-3 mt-4">
          {/* How It Works */}
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 
            dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200/50 
            dark:border-blue-800/50 rounded-2xl">
            <div className="space-y-2">
              <h4 className="font-bold text-sm flex items-center gap-2 text-foreground">
                <Sparkles className="w-4 h-4 text-blue-500" />
                How It Works
              </h4>
              <div className="text-xs text-muted-foreground leading-relaxed space-y-1">
                <p>🌱 <strong>Each plant is a unique NFT</strong> - You truly own it!</p>
                <p>🔄 <strong>Reusable forever</strong> - Grow multiple cycles with the same NFT</p>
                <p>💧 <strong>Use items to grow</strong> - Water (+15%) & Fertilizer (+20%)</p>
                <p>🎁 <strong>Earn rewards</strong> - Get 10 GDN when you reach 100%</p>
                <p>🤝 <strong>Help friends</strong> - Care for other plants for FREE (+1%)</p>
              </div>
            </div>
          </Card>

          {/* Pro Tip */}
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 
            dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200/50 
            dark:border-purple-800/50 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-foreground mb-1">
                  Pro Tip
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Buy extra GDN tokens now so you can keep using items without waiting! 
                  Each use costs GDN, and you'll want to maximize your plant's growth! 🚀
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Close button */}
        <div className="flex justify-end pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm 
              border-2 font-bold rounded-xl px-6 py-2"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}