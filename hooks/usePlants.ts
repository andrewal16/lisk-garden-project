'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
 * OPTIMIZED: With auto-refresh and optimistic updates
 */
export function usePlants() {
  const { client, account, isConnected, address, liskGardenV2Address } = useContract()
  const { toast } = useToast()
  const [plants, setPlants] = useState<Plant[]>([])
  const [gdnBalance, setGdnBalance] = useState<string>('0')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  // Track loading toasts to dismiss them
  const loadingToastRef = useRef<{ dismiss: () => void } | null>(null)

  // ✅ IMPROVED: Smart polling mechanism
  const pollForUpdates = useCallback(async (
    attempts = 3,
    delays = [3000, 5000, 7000] // 3s, 5s, 7s
  ) => {
    for (let i = 0; i < attempts; i++) {
      await new Promise(resolve => setTimeout(resolve, delays[i] || 5000))
      await fetchPlants(true) // Silent refresh
    }
  }, [])

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
          title: '❌ Error',
          description: 'Failed to fetch GDN balance',
          variant: 'destructive',
        })
      }
    }
  }, [client, address, toast])

  // ✅ IMPROVED: Fetch with better error handling
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
          title: '❌ Error',
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

  // ✅ IMPROVED: Buy GDN with better feedback
  const buyGdn = useCallback(async () => {
    if (!client || !account) {
      toast({
        title: '🔐 Wallet not connected',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    
    // Show loading toast
    const loadingToast = toast({
      title: '⏳ Processing...',
      description: 'Waiting for blockchain confirmation...',
      duration: Infinity,
    })

    try {
      const tx = await buyGdnContract(client, account)
      
      // Wait for confirmation
      await tx.wait?.()
      
      // Dismiss loading toast
      loadingToast.dismiss()

      // Show success
      toast({
        title: '✅ GDN purchased!',
        description: 'You received 100 GDN tokens for 0.0001 ETH 🎉',
      })

      // Immediate refresh
      await fetchPlants()
      
      // Background polling
      pollForUpdates()
    } catch (err: unknown) {
      console.error('Error buying GDN:', err)
      loadingToast.dismiss()
      
      // ✅ FIX: Better error handling
      const error = err as { message?: string; reason?: string; shortMessage?: string }
      const errorMessage = error.shortMessage || error.reason || error.message || 'Unknown error occurred'
      
      toast({
        title: '❌ Transaction Failed',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [client, account, toast, fetchPlants, pollForUpdates])

  // ✅ IMPROVED: Buy Plant NFT with approval flow
  const buyPlantNft = useCallback(async () => {
    if (!client || !account || !address) {
      toast({
        title: '🔐 Wallet not connected',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    
    const loadingToast = toast({
      title: '⏳ Processing...',
      description: 'Checking GDN allowance...',
      duration: Infinity,
    })

    try {
      // Check allowance
      const allowance = await getGdnAllowance(client, address, liskGardenV2Address)
      const allowanceNum = parseFloat(allowance)
      const requiredAmount = parseFloat(PLANT_NFT_COST)

      // Approve if needed
      if (allowanceNum < requiredAmount) {
        loadingToast.dismiss()
        
        const approvalToast = toast({
          title: '📝 Approval Required',
          description: 'Please approve GDN spending in your wallet...',
          duration: Infinity,
        })
        
        const approveTx = await approveGdn(client, account, '1000')
        await approveTx.wait?.()
        
        approvalToast.dismiss()
        
        toast({
          title: '✅ Approved!',
          description: 'GDN spending approved successfully',
        })
      }

      // Buy plant NFT
      const buyToast = toast({
        title: '⏳ Buying Plant NFT...',
        description: 'Waiting for blockchain confirmation...',
        duration: Infinity,
      })
      
      const tx = await buyPlantNftContract(client, account)
      await tx.wait?.()
      
      buyToast.dismiss()

      toast({
        title: '✅ Plant NFT purchased!',
        description: `You bought a plant NFT for ${PLANT_NFT_COST} GDN 🌱`,
      })

      // Immediate refresh
      await fetchPlants()
      
      // Background polling
      pollForUpdates()
    } catch (err: unknown) {
      console.error('Error buying plant NFT:', err)
      loadingToast.dismiss()
      
      // ✅ FIX: Better error handling
      const error = err as { message?: string; reason?: string; shortMessage?: string }
      const errorMessage = error.shortMessage || error.reason || error.message || 'Unknown error occurred'
      
      toast({
        title: '❌ Transaction Failed',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [client, account, address, liskGardenV2Address, toast, fetchPlants, pollForUpdates])

  // ✅ SUPER IMPROVED: Use item with instant feedback & auto-refresh
  const useItem = useCallback(
    async (plantId: bigint, itemType: ItemType) => {
      if (!client || !account || !address) {
        toast({
          title: '🔐 Wallet not connected',
          description: 'Please connect your wallet first',
          variant: 'destructive',
        })
        return
      }

      setLoading(true)
      
      const itemName = itemType === ItemType.FERTILIZER ? 'Fertilizer' : 'Water'
      const itemEmoji = itemType === ItemType.FERTILIZER ? '🔥' : '💧'
      const itemCost = itemType === ItemType.FERTILIZER ? '15' : '10'
      const progressIncrease = itemType === ItemType.FERTILIZER ? 20 : 15

      // Step 1: Check allowance
      const checkingToast = toast({
        title: '⏳ Checking allowance...',
        description: 'Please wait...',
        duration: Infinity,
      })

      try {
        const allowance = await getGdnAllowance(client, address, liskGardenV2Address)
        const allowanceNum = parseFloat(allowance)
        const requiredAmount = parseFloat(itemCost)

        checkingToast.dismiss()

        // Step 2: Approve if needed
        if (allowanceNum < requiredAmount) {
          const approvalToast = toast({
            title: '📝 Approval Required',
            description: 'Please approve GDN spending in your wallet...',
            duration: Infinity,
          })
          
          const approveTx = await approveGdn(client, account, '1000')
          await approveTx.wait?.()
          
          approvalToast.dismiss()
          
          toast({
            title: '✅ Approved!',
            description: 'GDN spending approved',
          })
        }

        // Step 3: Use item - Show persistent loading toast
        const loadingToast = toast({
          title: `${itemEmoji} Using ${itemName}...`,
          description: 'Waiting for blockchain confirmation...',
          duration: Infinity,
        })
        
        // Store reference to dismiss later
        loadingToastRef.current = loadingToast

        // Submit transaction
        const tx = await useItemContract(client, account, plantId, itemType)
        
        // Wait for confirmation
        await tx.wait?.()
        
        // Dismiss loading toast
        loadingToast.dismiss()
        loadingToastRef.current = null

        // Show success with animation
        toast({
          title: `✅ ${itemName} Applied!`,
          description: `Plant progress +${progressIncrease}% 🌱 (Cost: ${itemCost} GDN)`,
        })

        // IMMEDIATE REFRESH - This is key!
        await fetchPlants()
        
        // Continue polling in background for blockchain updates
        pollForUpdates(3, [2000, 4000, 6000]) // Poll at 2s, 4s, 6s after
        
      } catch (err: unknown) {
        console.error('Error using item:', err)
        
        // Dismiss any loading toast
        if (loadingToastRef.current) {
          loadingToastRef.current.dismiss()
          loadingToastRef.current = null
        }
        
        // ✅ FIX: Better error handling
        const error = err as { message?: string; reason?: string; shortMessage?: string }
        const errorMessage = error.shortMessage || error.reason || error.message || 'Unknown error occurred'
        
        toast({
          title: '❌ Transaction Failed',
          description: errorMessage,
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    },
    [client, account, address, liskGardenV2Address, toast, fetchPlants, pollForUpdates]
  )

  // ✅ IMPROVED: Care for other plant
  const careForOtherPlant = useCallback(
    async (plantId: bigint) => {
      if (!client || !account) {
        toast({
          title: '🔐 Wallet not connected',
          description: 'Please connect your wallet first',
          variant: 'destructive',
        })
        return
      }

      setLoading(true)
      
      const loadingToast = toast({
        title: '💚 Helping plant...',
        description: 'Sending your care to the plant...',
        duration: Infinity,
      })

      try {
        const tx = await careForOtherPlantContract(client, account, plantId)
        await tx.wait?.()
        
        loadingToast.dismiss()

        toast({
          title: '✅ Plant Helped!',
          description: 'You helped grow a friend\'s plant (+1% progress) for FREE! 🤝',
        })

        // Refresh with polling
        await fetchPlants()
        pollForUpdates()
      } catch (err: unknown) {
        console.error('Error caring for plant:', err)
        loadingToast.dismiss()
        
        // ✅ FIX: Better error handling
        const error = err as { message?: string; reason?: string; shortMessage?: string }
        const errorMessage = error.shortMessage || error.reason || error.message || 'Unknown error occurred'
        
        toast({
          title: '❌ Transaction Failed',
          description: errorMessage,
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    },
    [client, account, toast, fetchPlants, pollForUpdates]
  )

  // ✅ IMPROVED: Claim reward
  const claimReward = useCallback(
    async (plantId: bigint) => {
      if (!client || !account) {
        toast({
          title: '🔐 Wallet not connected',
          description: 'Please connect your wallet first',
          variant: 'destructive',
        })
        return
      }

      setLoading(true)
      
      const loadingToast = toast({
        title: '🎁 Claiming reward...',
        description: 'Harvesting your plant...',
        duration: Infinity,
      })

      try {
        const tx = await claimRewardContract(client, account, plantId)
        await tx.wait?.()
        
        loadingToast.dismiss()

        toast({
          title: '🎉 Reward Claimed!',
          description: 'You received 10 GDN! Plant reset to 0% for new cycle. 🔄',
        })

        // Refresh with polling
        await fetchPlants()
        pollForUpdates()
      } catch (err: unknown) {
        console.error('Error claiming reward:', err)
        loadingToast.dismiss()
        
        // ✅ FIX: Better error handling
        const error = err as { message?: string; reason?: string; shortMessage?: string }
        const errorMessage = error.shortMessage || error.reason || error.message || 'Unknown error occurred'
        
        toast({
          title: '❌ Transaction Failed',
          description: errorMessage,
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    },
    [client, account, toast, fetchPlants, pollForUpdates]
  )

  // Auto-fetch plants when connected
  useEffect(() => {
    if (isConnected && address) {
      fetchPlants()
    }
  }, [isConnected, address, fetchPlants])

  // ✅ IMPROVED: Auto-refresh every 20 seconds (optimized)
  useEffect(() => {
    if (!isConnected || !address) {
      return
    }

    const intervalId = setInterval(() => {
      fetchPlants(true) // Silent refresh
    }, 20000) // 20 seconds

    return () => clearInterval(intervalId)
  }, [isConnected, address, fetchPlants])

  // Cleanup loading toasts on unmount
  useEffect(() => {
    return () => {
      if (loadingToastRef.current) {
        loadingToastRef.current.dismiss()
      }
    }
  }, [])

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