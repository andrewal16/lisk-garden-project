"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Clock, Droplet, Flame } from "lucide-react"
import { Plant } from "@/types/contracts"
import { formatTimeRemaining } from "@/lib/contract"

const PROGRESS_COLORS = {
  low: "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100",
  medium: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100",
  high: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
  complete: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100",
}

const PROGRESS_BACKGROUNDS = {
  low: "from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950",
  medium: "from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950",
  high: "from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950",
  complete: "from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950",
}

const PROGRESS_BORDERS = {
  low: "border-red-300 dark:border-red-700",
  medium: "border-yellow-300 dark:border-yellow-700",
  high: "border-green-300 dark:border-green-700",
  complete: "border-emerald-300 dark:border-emerald-700",
}

function getProgressLevel(progress: number): keyof typeof PROGRESS_COLORS {
  if (progress >= 100) return 'complete'
  if (progress >= 60) return 'high'
  if (progress >= 30) return 'medium'
  return 'low'
}

export default function PlantCard({ plant }: { plant: Plant }) {
  const progressLevel = getProgressLevel(plant.progress)
  const canUseWater = plant.waterCountInCycle < 2
  const canUseFertilizer = plant.fertilizerCountInCycle < 2

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ease-out animate-grow border-2 cursor-pointer group hover:shadow-lg hover:-translate-y-1 ${PROGRESS_BORDERS[progressLevel]} hover:border-opacity-100`}
    >
      {/* Plant visualization */}
      <div className={`h-48 flex items-center justify-center relative overflow-hidden transition-all duration-300 ease-out bg-gradient-to-b ${PROGRESS_BACKGROUNDS[progressLevel]} group-hover:from-opacity-80 group-hover:to-opacity-80`}>
        {plant.progress >= 100 ? (
          <>
            <div className="text-7xl animate-float">🌸</div>
            <div className="absolute top-3 left-3 animate-bounce-in">
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="absolute top-6 right-6 text-2xl animate-pulse">✨</div>
            <div className="absolute bottom-6 left-6 text-xl opacity-50 animate-bounce">🌺</div>
            <div className="absolute bottom-6 right-6 text-xl opacity-50 animate-bounce delay-100">🦋</div>
          </>
        ) : plant.progress >= 60 ? (
          <>
            <div className="text-7xl animate-float">🪴</div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-emerald-600/40 dark:bg-emerald-400/40 rounded-full" />
            <div className="absolute top-6 left-6 text-lg opacity-30 animate-bounce">🍃</div>
            <div className="absolute bottom-6 right-6 text-lg opacity-30 animate-bounce delay-100">🍃</div>
          </>
        ) : plant.progress >= 30 ? (
          <>
            <div className="text-7xl animate-float">🌿</div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-3 bg-green-600/30 dark:bg-green-400/30 rounded-full" />
            <div className="absolute top-4 left-4 text-xl opacity-40 animate-pulse">💧</div>
            <div className="absolute top-4 right-4 text-xl opacity-40">☀️</div>
          </>
        ) : (
          <>
            <div className="text-7xl animate-float">🌱</div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-2 bg-amber-600/20 dark:bg-amber-400/20 rounded-full" />
            <div className="absolute top-4 right-4 text-2xl opacity-30">☀️</div>
          </>
        )}
      </div>

      {/* Plant info */}
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground text-lg">Plant #{plant.id.toString()}</h3>
            <div className="flex gap-2 mt-1 flex-wrap">
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${PROGRESS_COLORS[progressLevel]}`}>
                {plant.progress}% Growth
              </span>
              {plant.progress >= 100 && (
                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30">
                  Ready to Claim!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Growth Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              Progress
            </span>
            <span className="text-muted-foreground font-medium">{plant.progress}%</span>
          </div>
          <Progress value={plant.progress} className="h-2" />
        </div>

        {/* Item Usage */}
        <div className="grid grid-cols-2 gap-2">
          {/* Water */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Droplet className="w-3 h-3 text-blue-500" />
                Water
              </span>
              <span className={`font-medium ${canUseWater ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
                {plant.waterCountInCycle}/2
              </span>
            </div>
            {plant.waterTimeRemaining > 0 && (
              <p className="text-xs text-orange-600 dark:text-orange-400">
                <Clock className="w-3 h-3 inline mr-1" />
                {formatTimeRemaining(plant.waterTimeRemaining)}
              </p>
            )}
          </div>

          {/* Fertilizer */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Flame className="w-3 h-3 text-orange-500" />
                Fertilizer
              </span>
              <span className={`font-medium ${canUseFertilizer ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500'}`}>
                {plant.fertilizerCountInCycle}/2
              </span>
            </div>
            {plant.fertilizerTimeRemaining > 0 && (
              <p className="text-xs text-orange-600 dark:text-orange-400">
                <Clock className="w-3 h-3 inline mr-1" />
                {formatTimeRemaining(plant.fertilizerTimeRemaining)}
              </p>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {plant.progress < 100 && (
          <div className="text-xs text-muted-foreground pt-2 border-t border-border">
            {!canUseWater && !canUseFertilizer ? (
              <p className="text-orange-600 dark:text-orange-400">⏳ Wait for cycle reset to use items</p>
            ) : (
              <p className="text-green-600 dark:text-green-400">✨ Use items to increase progress!</p>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
