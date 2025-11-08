"use client"

import PlantCard from "@/components/plant-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Loader2, Sprout, RefreshCw } from "lucide-react"
import { usePlants } from "@/hooks/usePlants"
import { useContract } from "@/hooks/useContract"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

interface GardenGridProps {
  onSelectPlant: (plantId: bigint) => void
  onPlantSeed: () => void
}

export default function GardenGrid({ onSelectPlant, onPlantSeed }: GardenGridProps) {
  const { plants, loading, fetchPlants } = usePlants()
  const { isConnected } = useContract()
  const { toast } = useToast()

  const handleRefresh = async () => {
    await fetchPlants()
    toast({
      title: "🌱 Garden refreshed!",
      description: "All plant conditions have been updated.",
    })
  }

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black text-foreground font-cute">Your Garden</h2>
            <p className="text-muted-foreground mt-2 font-cute font-semibold">
              Tend to your plants and watch them grow ✨
            </p>
          </div>
        </div>

        <Card className="p-16 text-center border-4 border-dashed border-purple-300/50 
          bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl rounded-3xl">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sprout className="w-20 h-20 mx-auto mb-4 text-purple-400" />
          </motion.div>
          <h3 className="text-2xl font-black text-foreground mb-2 font-cute">
            Connect Your Wallet
          </h3>
          <p className="text-muted-foreground font-cute text-lg">
            Please connect your wallet to view and manage your garden 🌿
          </p>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black text-foreground font-cute">Your Garden</h2>
            <p className="text-muted-foreground mt-2 font-cute font-semibold">
              Tend to your plants and watch them grow ✨
            </p>
          </div>
        </div>

        <Card className="p-16 text-center bg-white/90 dark:bg-gray-800/90 shadow-2xl rounded-3xl">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-20 h-20 mx-auto mb-4 text-primary" />
          </motion.div>
          <p className="text-muted-foreground font-cute text-lg font-semibold">
            Loading your magical plants... 🪴
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-foreground font-cute">Your Garden</h2>
          <p className="text-muted-foreground mt-2 font-cute font-semibold">
            {plants.length === 0
              ? "Start your garden by planting your first seed 🌱"
              : `${plants.length} plant${plants.length !== 1 ? "s" : ""} growing beautifully! 🌸`}
          </p>
        </div>
        <div className="flex gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleRefresh}
              disabled={loading}
              variant="outline"
              className="gap-2 rounded-xl border-2 font-cute font-bold shadow-md hover:shadow-lg"
              title="Refresh plant conditions"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onPlantSeed}
              className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 
                hover:from-purple-600 hover:to-pink-600 text-white shadow-lg 
                hover:shadow-xl rounded-xl font-cute font-bold"
            >
              <Plus className="w-5 h-5" />
              Plant Seed
            </Button>
          </motion.div>
        </div>
      </div>

      {plants.length === 0 ? (
        <Card className="p-20 text-center border-4 border-dashed border-purple-300/50 
          bg-white/90 dark:bg-gray-800/90 shadow-2xl rounded-3xl">
          <motion.div 
            className="text-8xl mb-6"
            animate={{ 
              y: [0, -15, 0],
              rotate: [-5, 5, -5]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🌱
          </motion.div>
          <h3 className="text-3xl font-black text-foreground mb-3 font-cute">
            Your garden is empty
          </h3>
          <p className="text-muted-foreground mb-8 font-cute text-lg max-w-md mx-auto">
            Plant your first seed and start your Web3 garden journey! 🚀✨
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={onPlantSeed} 
              className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 
                hover:from-purple-600 hover:to-pink-600 text-white shadow-xl 
                rounded-xl font-cute font-bold text-lg py-6 px-8"
            >
              <Plus className="w-5 h-5" />
              Plant Your First Seed
            </Button>
          </motion.div>
        </Card>
      ) : (
        // ✅ WIDER CARDS: Changed from lg:grid-cols-3 to lg:grid-cols-2
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {plants.map((plant) => (
            <motion.div 
              key={plant.id.toString()} 
              onClick={() => onSelectPlant(plant.id)} 
              className="cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <PlantCard plant={plant} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}