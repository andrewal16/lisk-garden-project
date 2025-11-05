// Contract interaction utilities for Lisk Garden DApp V2
// New system: NFT-based plants + GDN ERC20 token economy

import { liskSepolia } from 'panna-sdk'
import { prepareContractCall, sendTransaction, readContract, waitForReceipt } from 'thirdweb/transaction'
import { getContract } from 'thirdweb/contract'
import { toWei, toEther } from 'thirdweb/utils'
import type { ThirdwebClient } from 'thirdweb'
import type { Account } from 'thirdweb/wallets'
import {
  LISK_GARDEN_V2_ADDRESS,
  GARDEN_TOKEN_ADDRESS,
  LISK_GARDEN_V2_ABI,
  GARDEN_TOKEN_ABI,
  Plant,
  ItemType,
  ITEM_NAMES,
  ETH_ENTRY_FEE,
  INITIAL_GDN_GIVEAWAY,
  REWARD_GDN_AMOUNT,
  PLANT_NFT_COST,
  FERTILIZER_COST,
  WATER_COST,
  MAX_CYCLE_USE,
  RESET_INTERVAL,
} from '@/types/contracts'

// Helper to convert GDN amount to wei (18 decimals)
export function gdnToWei(amount: string): bigint {
  return toWei(amount)
}

// Helper to convert wei to GDN (18 decimals)
export function weiToGdn(wei: bigint): string {
  return toEther(wei)
}

// Parse plant data from contract response
export function parsePlantData(plantId: bigint, rawData: unknown): Plant {
  const data = rawData as [bigint, bigint, bigint, bigint, bigint]
  return {
    id: plantId,
    owner: '', // Will be fetched separately if needed
    progress: Number(data[0]),
    waterCountInCycle: Number(data[1]),
    fertilizerCountInCycle: Number(data[2]),
    waterTimeRemaining: Number(data[3]),
    fertilizerTimeRemaining: Number(data[4]),
  }
}

// ============================================================================
// GardenToken (GDN) Functions
// ============================================================================

export async function getGdnBalance(client: ThirdwebClient, address: string): Promise<string> {
  const contract = getContract({
    client,
    chain: liskSepolia,
    address: GARDEN_TOKEN_ADDRESS,
  })

  const balance = await readContract({
    contract,
    method: 'function balanceOf(address account) view returns (uint256)',
    params: [address],
  })
  
  return weiToGdn(balance as bigint)
}

export async function getGdnAllowance(client: ThirdwebClient, owner: string, spender: string): Promise<string> {
  const contract = getContract({
    client,
    chain: liskSepolia,
    address: GARDEN_TOKEN_ADDRESS,
  })

  const allowance = await readContract({
    contract,
    method: 'function allowance(address owner, address spender) view returns (uint256)',
    params: [owner, spender],
  })
  
  return weiToGdn(allowance as bigint)
}

export async function approveGdn(client: ThirdwebClient, account: Account, amount: string) {
  const tx = prepareContractCall({
    contract: getContract({
      client,
      chain: liskSepolia,
      address: GARDEN_TOKEN_ADDRESS,
    }),
    method: 'function approve(address spender, uint256 amount) returns (bool)',
    params: [LISK_GARDEN_V2_ADDRESS, gdnToWei(amount)],
  })

  const result = await sendTransaction({
    account,
    transaction: tx,
  })

  await waitForReceipt(result)
  return result
}

// ============================================================================
// LiskGardenV2 Write Functions
// ============================================================================

export async function buyGdn(client: ThirdwebClient, account: Account) {
  const tx = prepareContractCall({
    contract: getContract({
      client,
      chain: liskSepolia,
      address: LISK_GARDEN_V2_ADDRESS,
    }),
    method: 'function buyGDN() payable',
    params: [],
    value: toWei(ETH_ENTRY_FEE),
  })

  const result = await sendTransaction({
    account,
    transaction: tx,
  })

  await waitForReceipt(result)
  return result
}

export async function buyPlantNft(client: ThirdwebClient, account: Account) {
  const tx = prepareContractCall({
    contract: getContract({
      client,
      chain: liskSepolia,
      address: LISK_GARDEN_V2_ADDRESS,
    }),
    method: 'function buyPlantNFT()',
    params: [],
  })

  const result = await sendTransaction({
    account,
    transaction: tx,
  })

  await waitForReceipt(result)
  return result
}

export async function useItem(client: ThirdwebClient, account: Account, plantId: bigint, itemType: ItemType) {
  const tx = prepareContractCall({
    contract: getContract({
      client,
      chain: liskSepolia,
      address: LISK_GARDEN_V2_ADDRESS,
    }),
    method: 'function useItem(uint256 plantId, uint8 item)',
    params: [plantId, itemType],
  })

  const result = await sendTransaction({
    account,
    transaction: tx,
  })

  await waitForReceipt(result)
  return result
}

export async function careForOtherPlant(client: ThirdwebClient, account: Account, plantId: bigint) {
  const tx = prepareContractCall({
    contract: getContract({
      client,
      chain: liskSepolia,
      address: LISK_GARDEN_V2_ADDRESS,
    }),
    method: 'function careForOtherPlant(uint256 plantId)',
    params: [plantId],
  })

  const result = await sendTransaction({
    account,
    transaction: tx,
  })

  await waitForReceipt(result)
  return result
}

export async function claimReward(client: ThirdwebClient, account: Account, plantId: bigint) {
  const tx = prepareContractCall({
    contract: getContract({
      client,
      chain: liskSepolia,
      address: LISK_GARDEN_V2_ADDRESS,
    }),
    method: 'function claimReward(uint256 plantId)',
    params: [plantId],
  })

  const result = await sendTransaction({
    account,
    transaction: tx,
  })

  await waitForReceipt(result)
  return result
}

// ============================================================================
// LiskGardenV2 Read Functions
// ============================================================================

export async function getPlantData(client: ThirdwebClient, plantId: bigint): Promise<Plant> {
  const contract = getContract({
    client,
    chain: liskSepolia,
    address: LISK_GARDEN_V2_ADDRESS,
  })

  const rawData = await readContract({
    contract,
    method: 'function getPlantData(uint256 plantId) view returns (uint256 progress, uint256 waterCountInCycle, uint256 fertilizerCountInCycle, uint256 waterTimeRemaining, uint256 fertilizerTimeRemaining)',
    params: [plantId],
  })

  const plant = parsePlantData(plantId, rawData)
  
  // Get owner
  const owner = await readContract({
    contract,
    method: 'function ownerOf(uint256 tokenId) view returns (address)',
    params: [plantId],
  })
  
  plant.owner = owner as string
  return plant
}

export async function getUserPlantIds(client: ThirdwebClient, userAddress: string): Promise<bigint[]> {
  const contract = getContract({
    client,
    chain: liskSepolia,
    address: LISK_GARDEN_V2_ADDRESS,
  })

  // First, get the balance to know how many plants to look for
  const balance = await readContract({
    contract,
    method: 'function balanceOf(address owner) view returns (uint256)',
    params: [userAddress],
  })

  const balanceNum = Number(balance)
  
  // If no plants, return empty array
  if (balanceNum === 0) {
    return []
  }

  const plantIds: bigint[] = []
  
  // Use a reasonable range to search (most contracts start from 1 and increment)
  // We'll search up to 1000 to avoid too many RPC calls
  const maxSearchRange = 1000
  let foundCount = 0
  
  // Search for plants owned by this user
  for (let i = 1; i <= maxSearchRange && foundCount < balanceNum; i++) {
    try {
      const owner = await readContract({
        contract,
        method: 'function ownerOf(uint256 tokenId) view returns (address)',
        params: [BigInt(i)],
      })
      
      if ((owner as string).toLowerCase() === userAddress.toLowerCase()) {
        plantIds.push(BigInt(i))
        foundCount++
      }
    } catch (err) {
      // Token doesn't exist, skip
      continue
    }
  }

  return plantIds
}

export async function getPlantOwner(client: ThirdwebClient, plantId: bigint): Promise<string> {
  const contract = getContract({
    client,
    chain: liskSepolia,
    address: LISK_GARDEN_V2_ADDRESS,
  })

  const owner = await readContract({
    contract,
    method: 'function ownerOf(uint256 tokenId) view returns (address)',
    params: [plantId],
  })

  return owner as string
}

// ============================================================================
// Helper Functions
// ============================================================================

export function canUseWater(plant: Plant): boolean {
  return plant.progress < 100 && plant.waterCountInCycle < MAX_CYCLE_USE
}

export function canUseFertilizer(plant: Plant): boolean {
  return plant.progress < 100 && plant.fertilizerCountInCycle < MAX_CYCLE_USE
}

export function canClaimReward(plant: Plant): boolean {
  return plant.progress >= 100
}

export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return 'Ready'
  
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  
  if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  return `${secs}s`
}

export function getItemCost(itemType: ItemType): string {
  return itemType === ItemType.FERTILIZER ? FERTILIZER_COST : WATER_COST
}

export function getItemName(itemType: ItemType): string {
  return ITEM_NAMES[itemType]
}

export function getItemProgressIncrease(itemType: ItemType): number {
  return itemType === ItemType.FERTILIZER ? 20 : 15
}

// Export constants for easy access
export {
  LISK_GARDEN_V2_ADDRESS,
  GARDEN_TOKEN_ADDRESS,
  ETH_ENTRY_FEE,
  INITIAL_GDN_GIVEAWAY,
  REWARD_GDN_AMOUNT,
  PLANT_NFT_COST,
  FERTILIZER_COST,
  WATER_COST,
  MAX_CYCLE_USE,
  RESET_INTERVAL,
}
