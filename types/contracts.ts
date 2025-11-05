// Contract Types and Constants for Lisk Garden DApp V2
// New system: NFT-based plants + GDN ERC20 token economy

// Item types for plant care
export enum ItemType {
  FERTILIZER = 0,
  WATER = 1,
}

// Plant data structure (NFT metadata + mutable state)
export interface PlantData {
  progress: number // 0-100%
  lastWaterResetTime: bigint // timestamp
  waterCount: number // usage count in current cycle
  lastFertilizerResetTime: bigint // timestamp
  fertilizerCount: number // usage count in current cycle
}

// Full plant info (NFT + data)
export interface Plant {
  id: bigint
  owner: string
  progress: number // 0-100%
  waterCountInCycle: number
  fertilizerCountInCycle: number
  waterTimeRemaining: number // seconds until reset
  fertilizerTimeRemaining: number // seconds until reset
}

// Item display names
export const ITEM_NAMES = {
  [ItemType.FERTILIZER]: 'Fertilizer',
  [ItemType.WATER]: 'Water',
} as const

// Contract constants (in wei for GDN token - 18 decimals)
export const ETH_ENTRY_FEE = '0.0001' // ETH to buy initial GDN
export const INITIAL_GDN_GIVEAWAY = '100' // 100 GDN tokens
export const REWARD_GDN_AMOUNT = '10' // 10 GDN reward
export const PLANT_NFT_COST = '50' // 50 GDN to buy plant NFT
export const FERTILIZER_COST = '15' // 15 GDN per use
export const WATER_COST = '10' // 10 GDN per use
export const MAX_CYCLE_USE = 2 // Max uses per cycle
export const RESET_INTERVAL = 120 // 2 minutes in seconds

// Contract addresses
export const LISK_GARDEN_V2_ADDRESS = process.env.NEXT_PUBLIC_LISK_GARDEN_V2_ADDRESS || ''
export const GARDEN_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_GARDEN_TOKEN_ADDRESS || ''

// LiskGardenV2 Contract ABI (simplified - only functions we use)
export const LISK_GARDEN_V2_ABI = [
  'function buyGDN() payable',
  'function buyPlantNFT()',
  'function useItem(uint256 plantId, uint8 item)',
  'function careForOtherPlant(uint256 plantId)',
  'function claimReward(uint256 plantId)',
  'function getPlantData(uint256 plantId) view returns (uint256 progress, uint256 waterCountInCycle, uint256 fertilizerCountInCycle, uint256 waterTimeRemaining, uint256 fertilizerTimeRemaining)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'event GDNBought(address indexed to, uint256 amount)',
  'event PlantPurchased(uint256 indexed plantId, address indexed buyer)',
  'event ProgressUpdated(uint256 indexed plantId, address indexed by, uint256 newProgress)',
  'event RewardClaimed(uint256 indexed plantId, address indexed owner, uint256 amount)',
] as const

// GardenToken (GDN) ERC20 ABI
export const GARDEN_TOKEN_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
] as const
