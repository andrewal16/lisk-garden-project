"use client"

import { Leaf, Coins, ShoppingCart, Users, Sparkles, Menu, Loader2 } from "lucide-react"
import { LoginButton, useActiveAccount, liskSepolia } from "panna-sdk"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface GardenHeaderProps {
  gdnBalance: string
  onVisitFriend?: () => void
}

export default function GardenHeader({ gdnBalance, onVisitFriend }: GardenHeaderProps) {
  const activeAccount = useActiveAccount()
  const isConnected = !!activeAccount
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  
  // ✅ FIX #2: Loading state for navigation
  const [isNavigating, setIsNavigating] = useState(false)

  const handleShopNavigation = async () => {
    setIsNavigating(true)
    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))
    router.push("/shop")
    // Reset after navigation starts
    setTimeout(() => setIsNavigating(false), 1000)
  }

  return (
    <>
      {/* Navigation Loading Overlay */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl border-4 border-purple-300 dark:border-purple-700"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto mb-4"
                >
                  <ShoppingCart className="w-full h-full text-purple-600" />
                </motion.div>
                <motion.p 
                  className="text-xl font-black text-foreground font-cute"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Opening Shop...
                </motion.p>
                <div className="mt-4 flex gap-2 justify-center">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 rounded-full bg-purple-600"
                      animate={{ 
                        scale: [1, 1.5, 1], 
                        opacity: [0.5, 1, 0.5] 
                      }}
                      transition={{ 
                        duration: 1, 
                        repeat: Infinity, 
                        delay: i * 0.2 
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header 
        className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r 
          from-pastel-pink/30 via-pastel-blue/30 to-pastel-green/30 
          border-b-4 border-gradient-cute shadow-cute-lg"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Animated gradient line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r 
            from-pink-500 via-purple-500 to-blue-500"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 400 }}
              onClick={() => {
                if (pathname === "/") {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                } else {
                  router.push("/")
                }
              }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 
                    rounded-3xl blur-xl opacity-50"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <motion.div 
                  className="relative w-14 h-14 bg-gradient-to-br from-green-400 via-emerald-500 
                    to-teal-500 rounded-3xl flex items-center justify-center shadow-cute-lg"
                  animate={{ 
                    rotate: [12, -12, 12],
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Leaf className="w-8 h-8 text-white drop-shadow-lg" />
                  </motion.div>
                </motion.div>
                
                {[0, 120, 240].map((angle, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      top: '50%',
                      left: '50%',
                    }}
                    animate={{
                      rotate: [angle, angle + 360],
                      x: [0, Math.cos((angle * Math.PI) / 180) * 40, 0],
                      y: [0, Math.sin((angle * Math.PI) / 180) * 40, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.3
                    }}
                  >
                    <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
                  </motion.div>
                ))}
              </div>
              
              <div>
                <motion.h1 
                  className="text-2xl sm:text-3xl font-bold bg-gradient-to-r 
                    from-primary via-emerald-600 to-teal-600 bg-clip-text text-transparent 
                    font-cute drop-shadow-sm"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: '200% auto',
                  }}
                >
                  Lisk Garden V2
                </motion.h1>
                <p className="text-xs text-muted-foreground font-cute flex items-center gap-1">
                  <motion.span 
                    className="inline-block"
                    animate={{ 
                      y: [0, -4, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    🌱
                  </motion.span>
                  NFT Garden Game
                </p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              {isConnected && onVisitFriend && (
                <motion.div
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    className="gap-2 rounded-2xl border-2 border-pastel-purple/60 
                      bg-gradient-to-r from-pastel-purple/20 to-pink-200/20 
                      hover:from-pastel-purple/30 hover:to-pink-200/30 
                      backdrop-blur-md transition-all duration-300 shadow-md 
                      hover:shadow-cute font-cute font-bold"
                    onClick={onVisitFriend}
                  >
                    <Users className="w-5 h-5 text-purple-600" />
                    <span>Visit Friend</span>
                  </Button>
                </motion.div>
              )}
              
              {isConnected && (
                <motion.div
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    className="gap-2 rounded-2xl border-2 border-cute-orange/60 
                      bg-gradient-to-r from-cute-orange/20 to-amber-200/20 
                      hover:from-cute-orange/30 hover:to-amber-200/30 
                      backdrop-blur-md transition-all duration-300 shadow-md 
                      hover:shadow-cute font-cute font-bold relative overflow-hidden"
                    onClick={handleShopNavigation}
                    disabled={isNavigating}
                  >
                    {isNavigating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-orange-600" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 text-orange-600" />
                        <span>Shop</span>
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
              
              {isConnected && (
                <motion.div 
                  className="relative px-5 py-3 rounded-2xl overflow-hidden shadow-cute-lg"
                  whileHover={{ scale: 1.08, boxShadow: "0 8px 30px rgba(251, 191, 36, 0.4)" }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-amber-100 via-yellow-100 
                      to-orange-100 dark:from-amber-900/40 dark:via-yellow-900/40 
                      dark:to-orange-900/40"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      backgroundSize: '200% 200%',
                    }}
                  />
                  
                  <div className="absolute inset-0 border-3 border-amber-300/50 
                    dark:border-amber-700/50 rounded-2xl" />
                  
                  <div className="relative flex items-center gap-3">
                    <motion.div
                      animate={{ 
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.15, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Coins className="w-6 h-6 text-amber-600 dark:text-amber-400 
                        drop-shadow-lg" />
                    </motion.div>
                    
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-amber-700 dark:text-amber-500 
                        font-cute">
                        GDN Balance
                      </span>
                      <motion.span 
                        className="text-lg font-bold text-amber-600 dark:text-amber-400 
                          font-cute drop-shadow-sm"
                        animate={{
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {parseFloat(gdnBalance).toFixed(2)} GDN
                      </motion.span>
                    </div>
                  </div>
                  
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-xl"
                      initial={{ 
                        bottom: 10,
                        left: `${20 + i * 30}%`,
                        opacity: 0 
                      }}
                      animate={{
                        bottom: 60,
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeOut"
                      }}
                    >
                      🪙
                    </motion.div>
                  ))}
                </motion.div>
              )}
              
              <motion.div
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <LoginButton chain={liskSepolia} />
                </div>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 
                backdrop-blur-md shadow-lg border-2 border-gray-200 dark:border-gray-700"
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden mt-4 space-y-3 overflow-hidden"
              >
                {isConnected && gdnBalance && (
                  <motion.div 
                    className="p-4 rounded-2xl bg-gradient-to-r from-amber-100 to-yellow-100 
                      dark:from-amber-900/40 dark:to-yellow-900/40 border-2 border-amber-300/50 
                      shadow-md"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <Coins className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      <div>
                        <span className="text-xs font-medium text-amber-700 dark:text-amber-500 
                          block font-cute">
                          GDN Balance
                        </span>
                        <span className="text-lg font-bold text-amber-600 dark:text-amber-400 
                          font-cute">
                          {parseFloat(gdnBalance).toFixed(2)} GDN
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {isConnected && onVisitFriend && (
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 rounded-2xl border-2 border-pastel-purple/60 
                        bg-gradient-to-r from-pastel-purple/20 to-pink-200/20 
                        font-cute font-bold py-6"
                      onClick={() => {
                        onVisitFriend()
                        setMobileMenuOpen(false)
                      }}
                    >
                      <Users className="w-5 h-5 text-purple-600" />
                      Visit Friend
                    </Button>
                  </motion.div>
                )}
                
                {isConnected && (
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 rounded-2xl border-2 border-cute-orange/60 
                        bg-gradient-to-r from-cute-orange/20 to-amber-200/20 
                        font-cute font-bold py-6"
                      onClick={() => {
                        handleShopNavigation()
                        setMobileMenuOpen(false)
                      }}
                      disabled={isNavigating}
                    >
                      {isNavigating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-orange-600" />
                          Loading Shop...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 text-orange-600" />
                          Shop
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
                
                <motion.div whileTap={{ scale: 0.98 }}>
                  <div className="rounded-2xl overflow-hidden">
                    <LoginButton chain={liskSepolia} />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom decorative wave */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r 
            from-transparent via-primary/30 to-transparent"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scaleX: [0.95, 1, 0.95],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.header>
    </>
  )
}