'use client'

import { useState, useEffect, useCallback } from 'react'
import { useContract } from './useContract'
import { getUserPlantIds, getPlantData } from '@/lib/contract'
import { Plant } from '@/types/contracts'

/**
 * Hook to fetch any user's plants by their address
 */
export function useFriendPlants(friendAddress: string | null) {
  const { client, isConnected } = useContract()
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchFriendPlants = useCallback(
    async (silent = false) => {
      if (!client || !friendAddress) {
        setPlants([])
        return
      }

      if (!silent) {
        setLoading(true)
      }
      setError(null)

      try {
        // Get friend's plant IDs
        const plantIds = await getUserPlantIds(client, friendAddress)

        // Fetch each plant's data
        const plantPromises = plantIds.map(async (id: bigint) => {
          try {
            const plant = await getPlantData(client, id)
            return plant
          } catch (err) {
            console.error(`Error fetching plant ${id}:`, err)
            return null
          }
        })

        const fetchedPlants = await Promise.all(plantPromises)
        const validPlants = fetchedPlants.filter((p): p is Plant => p !== null)

        setPlants(validPlants)
      } catch (err) {
        console.error('Error fetching friend plants:', err)
        setError(err as Error)
      } finally {
        if (!silent) {
          setLoading(false)
        }
      }
    },
    [client, friendAddress]
  )

  // Fetch when address changes
  useEffect(() => {
    if (isConnected && friendAddress) {
      fetchFriendPlants()
    }
  }, [isConnected, friendAddress, fetchFriendPlants])

  return {
    plants,
    loading,
    error,
    fetchFriendPlants,
  }
}
