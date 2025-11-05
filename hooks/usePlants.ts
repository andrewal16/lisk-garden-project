'use client'

import { useState, useEffect, useCallback } from 'react'
import { useContract } from './useContract'
import {
  getUserPlantIds,
  getPlantData,
  buyGdn as buyGdnContract,
  buyPlantNft as buyPlantNftContract,
  useItem as useItemContract,
  careForOtherPlant as careForOtherPlantContract,
  claimReward as claimRewardContract,
  getGdnBalance,
  approveGdn,
  getGdnAllowance,
} from '@/lib/contract'
import { Plant, ItemType, PLANT_NFT_COST } from '@/types/contracts'
import { useToast } from '@/hooks/use-toast'

/**
 * Hook to manage user's plants and GDN token for LiskGardenV2
 * New system: NFT-based plants + GDN ERC20 token economy
 */
export function usePlants() {
  const { client, account, isConnected, address, liskGardenV2Address } = useContract()
  const { toast } = useToast()
  const [plants, setPlants] = useState<Plant[]>([])
  const [gdnBalance, setGdnBalance] = useState<string>('0')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Fetch user's GDN balance
  const fetchGdnBalance = useCallback(async (silent = false) => {
    if (!client || !address) {
      setGdnBalance('0')
      return
    }

    try {
      const balance = await getGdnBalance(client, address)
      setGdnBalance(balance)
    } catch (err) {
      console.error('Error fetching GDN balance:', err)
      if (!silent) {
        toast({
          title: 'Error',
          description: 'Failed to fetch GDN balance',
          variant: 'destructive',
        })
      }
    }
  }, [client, address, toast])

  // Fetch user's plants (with optional silent mode for auto-refresh)
  const fetchPlants = useCallback(async (silent = false) => {
    if (!client || !address) {
      setPlants([])
      return
    }

    if (!silent) {
      setLoading(true)
    }
    setError(null)

    try {
      // Get user's plant IDs (NFTs owned)
      const plantIds = await getUserPlantIds(client, address)

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
      
      // Also fetch GDN balance
      await fetchGdnBalance(silent)
    } catch (err) {
      console.error('Error fetching plants:', err)
      setError(err as Error)
      if (!silent) {
        toast({
          title: 'Error',
          description: 'Failed to fetch your plants. Please try again.',
          variant: 'destructive',
        })
      }
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }, [client, address, toast, fetchGdnBalance])

  // Buy GDN tokens with ETH
  const buyGdn = useCallback(async () => {
    if (!client || !account) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      await buyGdnContract(client, account)

      toast({
        title: 'GDN purchased!',
        description: 'You received 100 GDN tokens for 0.0001 ETH',
      })

      await fetchPlants()
    } catch (err: unknown) {
      console.error('Error buying GDN:', err)
      const error = err as Error
      toast({
        title: 'Error',
        description: error.message || 'Failed to buy GDN. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [client, account, toast, fetchPlants])

  // Buy Plant NFT (costs 50 GDN)
  const buyPlantNft = useCallback(async () => {
    if (!client || !account || !address) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      // Check allowance
      const allowance = await getGdnAllowance(client, address, liskGardenV2Address)
      const allowanceNum = parseFloat(allowance)
      const requiredAmount = parseFloat(PLANT_NFT_COST)

      // Approve if needed
      if (allowanceNum < requiredAmount) {
        toast({
          title: 'Approving GDN...',
          description: 'Please approve GDN spending first',
        })
        await approveGdn(client, account, '1000') // Approve 1000 GDN for future transactions
      }

      await buyPlantNftContract(client, account)

      toast({
        title: 'Plant NFT purchased!',
        description: `You bought a plant NFT for ${PLANT_NFT_COST} GDN`,
      })

      await fetchPlants()
    } catch (err: unknown) {
      console.error('Error buying plant NFT:', err)
      const error = err as Error
      toast({
        title: 'Error',
        description: error.message || 'Failed to buy plant NFT. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [client, account, address, liskGardenV2Address, toast, fetchPlants])

  // Use item on plant (Water or Fertilizer)
  const useItem = useCallback(
    async (plantId: bigint, itemType: ItemType) => {
      if (!client || !account || !address) {
        toast({
          title: 'Wallet not connected',
          description: 'Please connect your wallet first',
          variant: 'destructive',
        })
        return
      }

      setLoading(true)
      try {
        // Check and approve if needed
        const itemCost = itemType === ItemType.FERTILIZER ? '15' : '10'
        const allowance = await getGdnAllowance(client, address, liskGardenV2Address)
        const allowanceNum = parseFloat(allowance)
        const requiredAmount = parseFloat(itemCost)

        if (allowanceNum < requiredAmount) {
          toast({
            title: 'Approving GDN...',
            description: 'Please approve GDN spending first',
          })
          await approveGdn(client, account, '1000')
        }

        await useItemContract(client, account, plantId, itemType)

        const itemName = itemType === ItemType.FERTILIZER ? 'Fertilizer' : 'Water'
        const progressIncrease = itemType === ItemType.FERTILIZER ? 20 : 15
        
        toast({
          title: `${itemName} used!`,
          description: `Plant progress increased by ${progressIncrease}%. Cost: ${itemCost} GDN`,
        })

        await fetchPlants()
      } catch (err: unknown) {
        console.error('Error using item:', err)
        const error = err as Error
        toast({
          title: 'Error',
          description: error.message || 'Failed to use item. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    },
    [client, account, address, liskGardenV2Address, toast, fetchPlants]
  )

  // Care for other player's plant (free, +1% progress)
  const careForOtherPlant = useCallback(
    async (plantId: bigint) => {
      if (!client || !account) {
        toast({
          title: 'Wallet not connected',
          description: 'Please connect your wallet first',
          variant: 'destructive',
        })
        return
      }

      setLoading(true)
      try {
        await careForOtherPlantContract(client, account, plantId)

        toast({
          title: 'Helped another plant!',
          description: 'You helped someone else\'s plant grow (+1% progress). FREE!',
        })

        await fetchPlants()
      } catch (err: unknown) {
        console.error('Error caring for plant:', err)
        const error = err as Error
        toast({
          title: 'Error',
          description: error.message || 'Failed to care for plant. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    },
    [client, account, toast, fetchPlants]
  )

  // Claim reward (10 GDN when progress reaches 100%)
  const claimReward = useCallback(
    async (plantId: bigint) => {
      if (!client || !account) {
        toast({
          title: 'Wallet not connected',
          description: 'Please connect your wallet first',
          variant: 'destructive',
        })
        return
      }

      setLoading(true)
      try {
        await claimRewardContract(client, account, plantId)

        toast({
          title: 'Reward claimed!',
          description: 'You received 10 GDN! Plant progress reset to 0% for new cycle.',
        })

        await fetchPlants()
      } catch (err: unknown) {
        console.error('Error claiming reward:', err)
        const error = err as Error
        toast({
          title: 'Error',
          description: error.message || 'Failed to claim reward. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    },
    [client, account, toast, fetchPlants]
  )

  // Auto-fetch plants when connected
  useEffect(() => {
    if (isConnected && address) {
      fetchPlants()
    }
  }, [isConnected, address, fetchPlants])

  // Auto-refresh data every 30 seconds (reduced to avoid rate limiting)
  useEffect(() => {
    if (!isConnected || !address) {
      return
    }

    const intervalId = setInterval(() => {
      fetchPlants(true) // true = silent mode (no loading state)
    }, 30000) // Changed from 5000ms to 30000ms (30 seconds)

    return () => clearInterval(intervalId)
  }, [isConnected, address, fetchPlants])

  return {
    plants,
    gdnBalance,
    loading,
    error,
    fetchPlants,
    buyGdn,
    buyPlantNft,
    useItem,
    careForOtherPlant,
    claimReward,
  }
}
