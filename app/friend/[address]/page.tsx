"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Users, Droplet, Flame, Sparkles, RefreshCw, Heart, Star } from "lucide-react"
import { useFriendPlants } from "@/hooks/useFriendPlants"
import { usePlants } from "@/hooks/usePlants"
import { useContract } from "@/hooks/useContract"
import { ItemType } from "@/types/contracts"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function FriendGardenPage() {
  const params = useParams()
  const friendAddress = params.address as string
  const { plants: friendPlants, loading: friendLoading, fetchFriendPlants } = useFriendPlants(friendAddress)
  const { useItem, careForOtherPlant, loading: actionLoading } = usePlants()
  const { isConnected, address } = useContract()
  const { toast } = useToast()

  const isOwnGarden = address?.toLowerCase() === friendAddress?.toLowerCase()

  const handleCareForPlant = async (plantId: bigint) => {
    try {
      await careForOtherPlant(plantId)
      await fetchFriendPlants(true)
      toast({
        title: "🎉 Plant helped!",
        description: "You gave this plant +1% progress for FREE! 🤝",
      })
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Failed to help plant. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleUseWater = async (plantId: bigint) => {
    try {
      await useItem(plantId, ItemType.WATER)
      await fetchFriendPlants(true)
      toast({
        title: "💧 Watered!",
        description: "Plant is refreshed and happy!",
      })
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Failed to water plant.",
        variant: "destructive"
      })
    }
  }

  const handleUseFertilizer = async (plantId: bigint) => {
    try {
      await useItem(plantId, ItemType.FERTILIZER)
      await fetchFriendPlants(true)
      toast({
        title: "🫘 Fertilized!",
        description: "Plant is growing stronger!",
      })
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Failed to fertilize plant.",
        variant: "destructive"
      })
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="outline" className="mb-6 gap-2 hover:scale-105 transition-transform">
              <ArrowLeft className="w-4 h-4" />
              Back to My Garden
            </Button>
          </Link>
          <Card className="p-12 text-center border-2 border-dashed border-primary/30 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 animate-fade-in">
            <Users className="w-16 h-16 mx-auto mb-4 text-primary/50 animate-bounce" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground">
              Please connect your wallet to visit friend's gardens 🌸
            </p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with cute decorative elements */}
        <div className="flex items-center justify-between animate-slide-down">
          <div>
            <Link href="/">
              <Button variant="outline" className="mb-4 gap-2 hover:scale-105 transition-all hover:shadow-md">
                <ArrowLeft className="w-4 h-4" />
                Back to My Garden
              </Button>
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
                <Users className="w-10 h-10 text-primary animate-pulse" />
                {isOwnGarden ? "Your Magical Garden" : "Friend's Garden"}
              </h1>
              <Star className="w-6 h-6 text-yellow-500 animate-spin-slow" />
            </div>
            <p className="text-muted-foreground mt-2 font-mono text-sm bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full inline-block">
              {friendAddress?.slice(0, 6)}...{friendAddress?.slice(-4)}
            </p>
          </div>
          <Button
            onClick={() => fetchFriendPlants()}
            disabled={friendLoading}
            variant="outline"
            className="gap-2 hover:scale-105 transition-all hover:shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${friendLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Info Card with cute gradient */}
        {!isOwnGarden && (
          <Card className="p-6 bg-gradient-to-br from-pink-100/80 via-purple-100/80 to-blue-100/80 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-blue-900/20 border-2 border-primary/20 backdrop-blur-sm animate-fade-in shadow-lg">
            <div className="flex items-start gap-4">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-full p-2 animate-bounce">
                <Heart className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2 text-lg flex items-center gap-2">
                  Help Your Friend Grow! 
                  <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You can help any plant for <strong className="text-pink-600 dark:text-pink-400">FREE</strong> by giving it +1% progress 🎁
                  <br />
                  Or use your own Water 💧 / Fertilizer 🫘 items on their plants!
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Plants Grid */}
        {friendLoading && friendPlants.length === 0 ? (
          <Card className="p-12 text-center backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 animate-fade-in">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <div className="text-4xl animate-bounce">🌱</div>
              <p className="text-muted-foreground font-medium">Loading magical plants...</p>
            </div>
          </Card>
        ) : friendPlants.length === 0 ? (
          <Card className="p-12 text-center border-2 border-dashed border-primary/30 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 animate-fade-in">
            <div className="text-8xl mb-6 animate-bounce">🌱</div>
            <h3 className="text-2xl font-bold text-foreground mb-3">No Plants Yet</h3>
            <p className="text-muted-foreground text-lg">
              {isOwnGarden 
                ? "Start your garden adventure! Visit the shop to get your first plant! 🏪"
                : "This garden is waiting to bloom... No plants yet! 🌸"}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {friendPlants.map((plant, index) => (
              <Card
                key={plant.id.toString()}
                className="overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 animate-fade-in hover:border-primary/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Plant Visual with enhanced gradients */}
                <div className={`h-56 flex items-center justify-center relative overflow-hidden ${
                  plant.progress >= 100 
                    ? 'bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900'
                    : plant.progress >= 60
                    ? 'bg-gradient-to-br from-green-100 via-lime-100 to-emerald-100 dark:from-green-900 dark:via-lime-900 dark:to-emerald-900'
                    : plant.progress >= 30
                    ? 'bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 dark:from-yellow-900 dark:via-amber-900 dark:to-orange-900'
                    : 'bg-gradient-to-br from-red-100 via-orange-100 to-yellow-100 dark:from-red-900 dark:via-orange-900 dark:to-yellow-900'
                }`}>
                  {/* Decorative circles */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-4 left-4 w-20 h-20 bg-white/20 rounded-full blur-xl animate-float" />
                    <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/20 rounded-full blur-xl animate-float-delayed" />
                  </div>
                  
                  {/* Plant emoji */}
                  <div className="text-8xl animate-float z-10 relative">
                    {plant.progress >= 100 ? '🌸' : plant.progress >= 60 ? '🪴' : plant.progress >= 30 ? '🌿' : '🌱'}
                  </div>
                  
                  {/* Sparkles for fully grown plants */}
                  {plant.progress >= 100 && (
                    <>
                      <div className="absolute top-3 right-3 animate-bounce">
                        <Sparkles className="w-7 h-7 text-yellow-400" />
                      </div>
                      <div className="absolute bottom-3 left-3 animate-bounce" style={{ animationDelay: '0.5s' }}>
                        <Star className="w-6 h-6 text-pink-400" />
                      </div>
                    </>
                  )}
                </div>

                {/* Plant Info */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-foreground text-xl flex items-center gap-2">
                      Plant #{plant.id.toString()}
                      {plant.progress >= 100 && <span className="animate-bounce">✨</span>}
                    </h3>
                    <div className="flex gap-2 mt-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        plant.progress >= 100 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                          : plant.progress >= 60
                          ? 'bg-gradient-to-r from-green-500 to-lime-500 text-white'
                          : plant.progress >= 30
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                          : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                      }`}>
                        {plant.progress}% Growth
                      </span>
                    </div>
                  </div>

                  {/* Progress bar with gradient */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Progress</span>
                      <span className="font-bold text-primary">{plant.progress}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={plant.progress} className="h-3 rounded-full" />
                      {plant.progress > 0 && plant.progress < 100 && (
                        <div 
                          className="absolute top-0 left-0 h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse"
                          style={{ width: `${plant.progress}%` }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Actions with improved styling */}
                  {!isOwnGarden && plant.progress < 100 && (
                    <div className="space-y-3 pt-3 border-t-2 border-dashed border-border">
                      <Button
                        onClick={() => handleCareForPlant(plant.id)}
                        disabled={actionLoading}
                        className="w-full gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                        size="lg"
                      >
                        {actionLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Heart className="w-5 h-5" />
                            Help Plant (+1% FREE)
                          </>
                        )}
                      </Button>

                      {/* <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => handleUseWater(plant.id)}
                          disabled={actionLoading}
                          variant="outline"
                          className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 transition-all hover:scale-105 font-semibold"
                          size="sm"
                        >
                          <Droplet className="w-4 h-4 text-blue-500" />
                          Water
                        </Button>
                        <Button
                          onClick={() => handleUseFertilizer(plant.id)}
                          disabled={actionLoading}
                          variant="outline"
                          className="gap-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-400 transition-all hover:scale-105 font-semibold"
                          size="sm"
                        >
                          <Flame className="w-4 h-4 text-orange-500" />
                          Fertilizer
                        </Button>
                      </div> */}
                    </div>
                  )}

                  {/* Fully grown badge */}
                  {plant.progress >= 100 && (
                    <div className="text-center p-4 bg-gradient-to-r from-yellow-400/20 via-pink-400/20 to-purple-400/20 border-2 border-yellow-400/50 rounded-xl animate-pulse">
                      <p className="text-base font-bold bg-gradient-to-r from-yellow-600 to-pink-600 bg-clip-text text-transparent">
                        ✨ Fully Grown! ✨
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-slide-down {
          animation: slide-down 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}