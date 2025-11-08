"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import HeroSection from "@/components/hero-section"
import GardenHeader from "@/components/garden-header"
import GardenGrid from "@/components/garden-grid"
import StatsSidebar from "@/components/stats-sidebar"
import PlantDetailsModal from "@/components/plant-details-modal"
import PlantSeedModal from "@/components/plant-seed-modal"
import VisitFriendModal from "@/components/visit-friend-modal"
import { usePlants } from "@/hooks/usePlants"
import { useContract } from "@/hooks/useContract"

export default function Home() {
  const [selectedPlantId, setSelectedPlantId] = useState<bigint | null>(null)
  const [showPlantSeedModal, setShowPlantSeedModal] = useState(false)
  const [showVisitFriendModal, setShowVisitFriendModal] = useState(false)
  const { plants, gdnBalance } = usePlants()
  const { isConnected } = useContract()
  const gardenRef = useRef<HTMLDivElement>(null)

  const selectedPlant = plants.find((p) => p.id === selectedPlantId) || null

  // ✅ FIX #4: Handle scroll to garden section from hash or query
  useEffect(() => {
    // Check if URL has #garden-section hash
    const hash = window.location.hash
    if (hash === "#garden-section") {
      setTimeout(() => {
        gardenRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        // Clean up hash
        window.history.replaceState(null, '', window.location.pathname)
      }, 100)
    }
  }, [])

  const scrollToGarden = () => {
    gardenRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleGetStarted = () => {
    if (isConnected) {
      scrollToGarden()
    } else {
      scrollToGarden()
    }
  }

  const handleLearnMore = () => {
    scrollToGarden()
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Always visible */}
      <HeroSection 
        onGetStarted={handleGetStarted}
        onLearnMore={handleLearnMore}
      />

      {/* ✅ FIX #4: Garden section with ID for scroll targeting */}
      <div 
        id="garden-section" 
        ref={gardenRef} 
        className="relative bg-gradient-to-b from-white via-green-50/30 to-emerald-50/50 
          dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"
      >
        {/* Decorative top border */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        />
        
        <GardenHeader 
          gdnBalance={gdnBalance} 
          onVisitFriend={() => setShowVisitFriendModal(true)}
        />
        
        {/* Garden Content with beautiful spacing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex gap-6 p-6 max-w-7xl mx-auto"
        >
          <main className="flex-1">
            <GardenGrid 
              onSelectPlant={setSelectedPlantId} 
              onPlantSeed={() => setShowPlantSeedModal(true)} 
            />
          </main>
          
          <aside className="w-80 hidden lg:block">
            <StatsSidebar 
              selectedPlantId={selectedPlantId}
            />
          </aside>
        </motion.div>

        {/* Bottom decorative wave */}
        <div className="mt-12">
          <svg viewBox="0 0 1440 100" className="w-full h-auto">
            <defs>
              <linearGradient id="bottomWave" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,50 Q360,20 720,50 T1440,50 L1440,100 L0,100 Z"
              fill="url(#bottomWave)"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2 }}
              viewport={{ once: true }}
            />
          </svg>
        </div>

        {/* Scroll to top button - appears when scrolled down */}
        <motion.button
          className="fixed bottom-8 right-8 p-4 rounded-full bg-gradient-to-r 
            from-purple-500 to-pink-500 text-white shadow-2xl z-50 
            hover:shadow-purple-500/50 transition-all"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1, rotate: 360 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          viewport={{ once: false }}
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ⬆️
          </motion.div>
        </motion.button>
      </div>

      {/* Modals */}
      <PlantDetailsModal
        plant={selectedPlant}
        isOpen={!!selectedPlantId}
        onClose={() => setSelectedPlantId(null)}
      />
      <PlantSeedModal 
        isOpen={showPlantSeedModal} 
        onClose={() => setShowPlantSeedModal(false)} 
      />
      <VisitFriendModal 
        isOpen={showVisitFriendModal} 
        onClose={() => setShowVisitFriendModal(false)} 
      />
    </div>
  )
}