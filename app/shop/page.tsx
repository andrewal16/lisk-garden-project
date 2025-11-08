"use client"

import { useState, useMemo, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Coins, Droplet, Flame, Sparkles, ShoppingCart, ArrowLeft, Info, Check, Loader2 } from "lucide-react"
import { usePlants } from "@/hooks/usePlants"
import { useContract } from "@/hooks/useContract"
import { ItemType, ETH_ENTRY_FEE, INITIAL_GDN_GIVEAWAY, PLANT_NFT_COST, WATER_COST, FERTILIZER_COST } from "@/types/contracts"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

// Page Loading Component
const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-20 h-20 mx-auto mb-4"
      >
        <ShoppingCart className="w-full h-full text-purple-600" />
      </motion.div>
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-xl font-black text-foreground font-cute"
      >
        Loading Shop...
      </motion.div>
      <div className="mt-4 flex gap-2 justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-purple-600"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  </div>
)

// Optimized animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function ShopPage() {
  const { plants, gdnBalance, buyGdn, buyPlantNft, useItem, loading } = usePlants()
  const { isConnected } = useContract()
  const [selectedPlantId, setSelectedPlantId] = useState<bigint | null>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const router = useRouter()

  // Simulate page load
  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Memoize calculated values
  const gdnBalanceNum = useMemo(() => parseFloat(gdnBalance), [gdnBalance])
  const canBuyPlant = useMemo(() => gdnBalanceNum >= parseFloat(PLANT_NFT_COST), [gdnBalanceNum])
  const canBuyWater = useMemo(() => gdnBalanceNum >= parseFloat(WATER_COST), [gdnBalanceNum])
  const canBuyFertilizer = useMemo(() => gdnBalanceNum >= parseFloat(FERTILIZER_COST), [gdnBalanceNum])

  // ✅ FIX #3: Filter out 100% plants and check if selected plant is 100%
  const availablePlants = useMemo(() => 
    plants.filter(p => p.progress < 100), 
    [plants]
  )
  
  // Auto-deselect if selected plant reaches 100%
  useEffect(() => {
    if (selectedPlantId) {
      const selectedPlant = plants.find(p => p.id === selectedPlantId)
      if (selectedPlant && selectedPlant.progress >= 100) {
        setSelectedPlantId(null)
      }
    }
  }, [plants, selectedPlantId])

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

  // ✅ FIX #4: Scroll to garden section instead of href="/"
  const handleBackToGarden = () => {
    router.push("/#garden-section")
  }

  // Show page loader
  if (pageLoading) {
    return <PageLoader />
  }

  // Not connected state
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 
        dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <Button 
            onClick={handleBackToGarden}
            variant="outline" 
            className="mb-6 gap-2 rounded-xl border-2 font-cute font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Garden
          </Button>
          
          <Card className="p-16 text-center border-4 border-dashed border-purple-300 
            bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-7xl mb-4">🔐</div>
            </motion.div>
            <h3 className="text-2xl font-black text-foreground mb-3 font-cute">
              Connect Your Wallet
            </h3>
            <p className="text-muted-foreground font-cute text-lg">
              Please connect your wallet to access the shop ✨
            </p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 
          dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 p-4 sm:p-6"
      >
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex-1">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={handleBackToGarden}
                  variant="outline" 
                  className="mb-4 gap-2 rounded-xl border-2 font-cute font-bold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Garden
                </Button>
              </motion.div>
              
              <div className="flex items-center gap-3 mb-2">
                <motion.div 
                  className="p-3 rounded-2xl bg-gradient-to-br from-purple-200 to-pink-200 
                    dark:from-purple-800 dark:to-pink-800"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ShoppingCart className="w-8 h-8 text-purple-700 dark:text-purple-200" />
                </motion.div>
                <h1 className="text-4xl sm:text-5xl font-black text-foreground font-cute">
                  Garden Shop
                </h1>
              </div>
              <p className="text-muted-foreground font-cute text-base font-semibold">
                Buy GDN, plants, and items to grow your garden 🌱✨
              </p>
            </div>
            
            {/* Balance Card */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-5 bg-gradient-to-br from-amber-100 to-yellow-100 
                dark:from-amber-900/40 dark:to-yellow-900/40 
                border-3 border-amber-300 dark:border-amber-700 shadow-xl rounded-2xl
                min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Coins className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </motion.div>
                  <span className="text-sm font-bold text-muted-foreground font-cute">
                    Your Balance
                  </span>
                </div>
                <motion.p 
                  className="text-3xl font-black text-amber-600 dark:text-amber-400 font-cute"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {gdnBalanceNum.toFixed(2)} GDN
                </motion.p>
              </Card>
            </motion.div>
          </motion.div>

          {/* Step Guide */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 
              dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 
              border-3 border-purple-300/50 dark:border-purple-700/50 rounded-2xl shadow-lg">
              <div className="flex items-start gap-4">
                <motion.div 
                  className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-md"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Info className="w-6 h-6 text-purple-600" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-black text-foreground mb-3 font-cute text-xl">
                    🎯 How to Start Growing
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-3 text-sm font-cute font-semibold">
                    {[
                      { num: 1, text: "Buy GDN Tokens", color: "bg-purple-500" },
                      { num: 2, text: "Buy Plant NFT", color: "bg-pink-500" },
                      { num: 3, text: "Use Items to Grow", color: "bg-orange-500" }
                    ].map((step) => (
                      <motion.div
                        key={step.num}
                        className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 p-3 rounded-xl"
                        whileHover={{ scale: 1.05, x: 5 }}
                      >
                        <span className={`flex items-center justify-center w-6 h-6 rounded-full 
                          ${step.color} text-white text-xs font-black`}>
                          {step.num}
                        </span>
                        <span>{step.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Main Shop Items */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-black text-foreground mb-4 font-cute flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Step 1 & 2: Get Started
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Buy GDN Card */}
              <motion.div whileHover={{ scale: 1.02, y: -5 }}>
                <Card className="overflow-hidden border-3 rounded-2xl shadow-xl 
                  hover:shadow-2xl transition-all duration-300 group
                  bg-gradient-to-br from-amber-50 to-yellow-50 
                  dark:from-amber-900/20 dark:to-yellow-900/20
                  border-amber-300 dark:border-amber-700">
                  
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <motion.div 
                        className="text-6xl"
                        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        💰
                      </motion.div>
                      <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 
                        rounded-full text-xs font-black text-green-700 dark:text-green-300 
                        border-2 border-green-300">
                        STEP 1
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-black text-foreground mb-2 font-cute">
                        Buy GDN Tokens
                      </h3>
                      <p className="text-sm text-muted-foreground font-cute font-semibold">
                        Purchase Garden Tokens to use in the game
                      </p>
                    </div>
                    
                    <div className="bg-white/80 dark:bg-gray-800/80 border-2 border-amber-200 
                      dark:border-amber-800 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground font-cute font-bold">
                          You Pay
                        </span>
                        <span className="font-black text-xl text-foreground font-cute">
                          {ETH_ENTRY_FEE} ETH
                        </span>
                      </div>
                      <div className="h-px bg-border" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground font-cute font-bold">
                          You Get
                        </span>
                        <div className="flex items-center gap-2">
                          <Coins className="w-5 h-5 text-amber-600" />
                          <span className="font-black text-xl text-amber-600 dark:text-amber-400 font-cute">
                            {INITIAL_GDN_GIVEAWAY} GDN
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleBuyGdn}
                      disabled={loading}
                      className="w-full gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 
                        hover:from-amber-600 hover:to-yellow-600 text-white font-black 
                        rounded-xl py-6 text-base shadow-lg font-cute"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
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
              </motion.div>

              {/* Buy Plant NFT Card */}
              <motion.div whileHover={{ scale: canBuyPlant ? 1.02 : 1, y: canBuyPlant ? -5 : 0 }}>
                <Card className={`overflow-hidden border-3 rounded-2xl shadow-xl 
                  hover:shadow-2xl transition-all duration-300 group
                  ${canBuyPlant 
                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-300 dark:border-emerald-700' 
                    : 'bg-gray-50 dark:bg-gray-900/20 border-gray-300 dark:border-gray-700 opacity-75'
                  }`}>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <motion.div 
                        className="text-6xl"
                        animate={canBuyPlant ? { 
                          y: [0, -10, 0],
                          rotate: [0, 10, -10, 0] 
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        🌱
                      </motion.div>
                      <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 
                        rounded-full text-xs font-black text-purple-700 dark:text-purple-300 
                        border-2 border-purple-300">
                        STEP 2
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-black text-foreground mb-2 font-cute">
                        Buy Plant NFT
                      </h3>
                      <p className="text-sm text-muted-foreground font-cute font-semibold">
                        Get a unique plant NFT to start growing
                      </p>
                    </div>
                    
                    <div className="bg-white/80 dark:bg-gray-800/80 border-2 
                      border-emerald-200 dark:border-emerald-800 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground font-cute font-bold">
                          Cost
                        </span>
                        <div className="flex items-center gap-2">
                          <Coins className="w-5 h-5 text-emerald-600" />
                          <span className="font-black text-xl text-emerald-600 dark:text-emerald-400 font-cute">
                            {PLANT_NFT_COST} GDN
                          </span>
                        </div>
                      </div>
                      <div className="h-px bg-border" />
                      <div className="space-y-2">
                        {["ERC-721 NFT", "Reusable Forever", "Infinite Growth Cycles"].map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-cute font-bold">
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={handleBuyPlant}
                      disabled={loading || !canBuyPlant}
                      className={`w-full gap-2 font-black rounded-xl py-6 text-base 
                        shadow-lg font-cute transition-all
                        ${canBuyPlant 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white' 
                          : 'bg-gray-300 dark:bg-gray-700 text-gray-500'
                        }`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          {canBuyPlant ? 'Buy Plant NFT' : `Need ${(parseFloat(PLANT_NFT_COST) - gdnBalanceNum).toFixed(2)} more GDN`}
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>

          {/* Items Section - Only if has available plants */}
          {availablePlants.length > 0 && (
            <>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-black text-foreground mb-4 font-cute flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-600" />
                  Step 3: Grow Your Plants
                </h2>
                
                <Card className="p-5 bg-gradient-to-r from-orange-100 to-red-100 
                  dark:from-orange-900/30 dark:to-red-900/30 
                  border-3 border-orange-300/50 dark:border-orange-700/50 
                  rounded-2xl shadow-lg mb-4">
                  <p className="text-sm text-muted-foreground font-cute font-bold text-center">
                    💡 Select a growing plant below, then choose Water or Fertilizer to boost it!
                    {plants.some(p => p.progress >= 100) && (
                      <span className="block mt-1 text-green-600 dark:text-green-400">
                        ✨ Plants at 100% are ready to claim rewards in your garden!
                      </span>
                    )}
                  </p>
                </Card>
              </motion.div>

              {/* Plant Selector - Only show plants < 100% */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg font-black text-foreground mb-3 font-cute">
                  Select Your Growing Plant:
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {availablePlants.map((plant) => (
                    <motion.button
                      key={plant.id.toString()}
                      onClick={() => setSelectedPlantId(plant.id)}
                      className={`p-4 rounded-2xl border-3 transition-all
                        ${selectedPlantId === plant.id
                          ? 'border-purple-500 bg-purple-100 dark:bg-purple-900/30 shadow-xl scale-105'
                          : 'border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 hover:border-purple-300'
                        }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-center space-y-2">
                        <motion.div 
                          className="text-5xl"
                          animate={selectedPlantId === plant.id ? { 
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {plant.progress >= 60 ? '🪴' : plant.progress >= 30 ? '🌿' : '🌱'}
                        </motion.div>
                        <p className="text-xs font-black font-cute">
                          Plant #{plant.id.toString()}
                        </p>
                        <Progress value={plant.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground font-bold font-cute">
                          {plant.progress}%
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Items */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Water Card */}
                <motion.div whileHover={{ scale: 1.02, y: -5 }}>
                  <Card className="overflow-hidden border-3 rounded-2xl shadow-xl 
                    bg-gradient-to-br from-blue-50 to-cyan-50 
                    dark:from-blue-900/20 dark:to-cyan-900/20
                    border-blue-300 dark:border-blue-700">
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <motion.div 
                          className="text-6xl"
                          animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          💧
                        </motion.div>
                        <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 
                          rounded-full text-xs font-black text-blue-700 dark:text-blue-300 
                          border-2 border-blue-300">
                          +15%
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-black text-foreground mb-2 font-cute">
                          Water
                        </h3>
                        <p className="text-sm text-muted-foreground font-cute font-semibold">
                          Increase plant progress by 15%
                        </p>
                      </div>
                      
                      <div className="bg-white/80 dark:bg-gray-800/80 border-2 border-blue-200 
                        dark:border-blue-800 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground font-cute font-bold">Cost</span>
                          <div className="flex items-center gap-2">
                            <Coins className="w-5 h-5 text-blue-600" />
                            <span className="font-black text-xl text-blue-600 dark:text-blue-400 font-cute">
                              {WATER_COST} GDN
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground font-cute font-bold">
                          ⚡ Max 2 uses per cycle • Resets every 2 minutes
                        </p>
                      </div>

                      <Button
                        onClick={handleBuyWater}
                        disabled={loading || !selectedPlantId || !canBuyWater}
                        className="w-full gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 
                          hover:from-blue-600 hover:to-cyan-600 text-white font-black 
                          rounded-xl py-6 text-base shadow-lg font-cute disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : !selectedPlantId ? (
                          <>
                            <Droplet className="w-5 h-5" />
                            Select a Plant First
                          </>
                        ) : !canBuyWater ? (
                          <>Need {(parseFloat(WATER_COST) - gdnBalanceNum).toFixed(2)} more GDN</>
                        ) : (
                          <>
                            <Droplet className="w-5 h-5" />
                            Use on Plant #{selectedPlantId.toString()}
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </motion.div>

                {/* Fertilizer Card */}
                <motion.div whileHover={{ scale: 1.02, y: -5 }}>
                  <Card className="overflow-hidden border-3 rounded-2xl shadow-xl 
                    bg-gradient-to-br from-orange-50 to-red-50 
                    dark:from-orange-900/20 dark:to-red-900/20
                    border-orange-300 dark:border-orange-700">
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <motion.div 
                          className="text-6xl"
                          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          🔥
                        </motion.div>
                        <div className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 
                          rounded-full text-xs font-black text-orange-700 dark:text-orange-300 
                          border-2 border-orange-300">
                          +20%
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-black text-foreground mb-2 font-cute">
                          Fertilizer
                        </h3>
                        <p className="text-sm text-muted-foreground font-cute font-semibold">
                          Increase plant progress by 20%
                        </p>
                      </div>
                      
                      <div className="bg-white/80 dark:bg-gray-800/80 border-2 border-orange-200 
                        dark:border-orange-800 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground font-cute font-bold">Cost</span>
                          <div className="flex items-center gap-2">
                            <Coins className="w-5 h-5 text-orange-600" />
                            <span className="font-black text-xl text-orange-600 dark:text-orange-400 font-cute">
                              {FERTILIZER_COST} GDN
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground font-cute font-bold">
                          ⚡ Max 2 uses per cycle • Resets every 2 minutes
                        </p>
                      </div>

                      <Button
                        onClick={handleBuyFertilizer}
                        disabled={loading || !selectedPlantId || !canBuyFertilizer}
                        className="w-full gap-2 bg-gradient-to-r from-orange-500 to-red-500 
                          hover:from-orange-600 hover:to-red-600 text-white font-black 
                          rounded-xl py-6 text-base shadow-lg font-cute disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : !selectedPlantId ? (
                          <>
                            <Flame className="w-5 h-5" />
                            Select a Plant First
                          </>
                        ) : !canBuyFertilizer ? (
                          <>Need {(parseFloat(FERTILIZER_COST) - gdnBalanceNum).toFixed(2)} more GDN</>
                        ) : (
                          <>
                            <Flame className="w-5 h-5" />
                            Use on Plant #{selectedPlantId.toString()}
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            </>
          )}

          {/* No Available Plants Message */}
          {plants.length > 0 && availablePlants.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-10 text-center bg-gradient-to-br from-green-100 to-emerald-100 
                dark:from-green-900/30 dark:to-emerald-900/30 border-3 border-green-300 
                dark:border-green-700 rounded-2xl shadow-xl">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-7xl mb-4"
                >
                  🎉
                </motion.div>
                <h3 className="text-2xl font-black text-foreground mb-3 font-cute">
                  All Plants Ready to Harvest!
                </h3>
                <p className="text-muted-foreground font-cute text-lg mb-6">
                  All your plants have reached 100%! Go to your garden to claim rewards 🌸
                </p>
                <Button
                  onClick={handleBackToGarden}
                  className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 
                    hover:from-green-600 hover:to-emerald-600 text-white font-black 
                    rounded-xl py-6 px-8 text-lg font-cute"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Go to Garden
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Info Card */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 
              dark:from-purple-900/30 dark:to-pink-900/30 
              border-3 border-purple-300/50 dark:border-purple-700/50 rounded-2xl shadow-lg">
              <h3 className="font-black text-foreground mb-4 font-cute text-xl flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                💡 Shop Guide & Tips
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm font-cute font-semibold">
                <div className="space-y-2">
                  {[
                    "Buy GDN tokens first to purchase plants and items",
                    "Each plant NFT can be grown infinitely in cycles",
                    "Fertilizer (+20%) gives more boost than Water (+15%)"
                  ].map((tip, i) => (
                    <p key={i} className="flex items-start gap-2">
                      <span className="text-purple-600 mt-0.5">•</span>
                      <span>{tip}</span>
                    </p>
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    "Items have a 2-minute cycle limit (max 2 uses each)",
                    "Claim 10 GDN reward when your plant reaches 100%",
                    "Help friends' plants for FREE to earn together! 💚"
                  ].map((tip, i) => (
                    <p key={i} className="flex items-start gap-2">
                      <span className="text-pink-600 mt-0.5">•</span>
                      <span>{tip}</span>
                    </p>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}