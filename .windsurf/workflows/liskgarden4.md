---
description: Lisk Garden DApp - Web3 Architecture with Panna SDK
auto_execution_mode: 1
---

# Web3 Architecture with Panna SDK & Thirdweb

## Core Web3 Stack
- **Panna SDK 0.1.0**: Wallet authentication & provider
- **Thirdweb SDK**: Contract interactions (bundled with Panna)
- **Lisk Sepolia Testnet**: Chain ID 4202
- **Contract Address**: 0xf44adEdec3f5E7a9794bC8E830BE67e4855FA8fF

## Provider Setup Pattern

### Root Provider (components/providers.tsx)
```typescript
'use client'
import { PannaProvider } from 'panna-sdk'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PannaProvider
      clientId={process.env.NEXT_PUBLIC_PANNA_CLIENT_ID}
      partnerId={process.env.NEXT_PUBLIC_PANNA_PARTNER_ID}
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster />
      </ThemeProvider>
    </PannaProvider>
  )
}
```

### Root Layout (app/layout.tsx)
```typescript
import { Providers } from "@/components/providers"

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

## Custom Hooks Architecture

### 1. useContract Hook (hooks/useContract.ts)
Basic hook for accessing Panna client and account:
```typescript
'use client'
import { useMemo } from 'react'
import { useActiveAccount, usePanna } from 'panna-sdk'

export function useContract() {
  const activeAccount = useActiveAccount()
  const { client } = usePanna()

  const contractInfo = useMemo(() => ({
    client: client || null,
    account: activeAccount || null,
    isConnected: !!activeAccount && !!client,
    address: activeAccount?.address || null,
    contractAddress: LISK_GARDEN_CONTRACT_ADDRESS,
  }), [activeAccount, client])

  return contractInfo
}
```

### 2. usePlants Hook (hooks/usePlants.ts)
Main hook for plant CRUD operations:
```typescript
export function usePlants() {
  const { client, account, isConnected, address } = useContract()
  const { toast } = useToast()
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch with silent mode for auto-refresh
  const fetchPlants = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    const plantIds = await getUserPlants(client, address)
    const plants = await Promise.all(plantIds.map(id => getPlant(client, id)))
    setPlants(plants.filter(p => p.exists))
    if (!silent) setLoading(false)
  }, [client, address])

  // Auto-fetch on connect
  useEffect(() => {
    if (isConnected) fetchPlants()
  }, [isConnected, address])

  // Auto-refresh every 5 seconds (silent)
  useEffect(() => {
    if (!isConnected) return
    const interval = setInterval(() => fetchPlants(true), 5000)
    return () => clearInterval(interval)
  }, [isConnected, fetchPlants])

  return {
    plants,
    loading,
    plantSeed,
    waterPlant,
    harvestPlant,
    updatePlantStage,
    fetchPlants,
  }
}
```

### 3. usePlantStageScheduler Hook (hooks/usePlantStageScheduler.ts)
Background scheduler for auto-updating plant stages:
```typescript
export function usePlantStageScheduler() {
  const { client, account, isConnected } = useContract()
  const { plants } = usePlants()
  const isProcessingRef = useRef(false)

  const updatePlantsStages = useCallback(async () => {
    if (isProcessingRef.current || !isConnected) return
    isProcessingRef.current = true

    const plantsNeedingUpdate = plants.filter(p => 
      !p.isDead && p.stage !== GrowthStage.BLOOMING && isStageOutOfSync(p)
    )

    // Update sequentially to avoid nonce conflicts
    for (const plant of plantsNeedingUpdate) {
      await updatePlantStageContract(client, account, plant.id)
    }

    isProcessingRef.current = false
  }, [client, account, plants])

  // Run every 60 seconds
  useEffect(() => {
    if (!isConnected || plants.length === 0) return
    updatePlantsStages() // Run immediately
    const interval = setInterval(updatePlantsStages, 60000)
    return () => clearInterval(interval)
  }, [isConnected, plants.length, updatePlantsStages])

  return { isRunning: isConnected && plants.length > 0 }
}
```

## Contract Interaction Patterns

### Write Operations (lib/contract.ts)
```typescript
import { prepareContractCall, sendTransaction, waitForReceipt } from 'thirdweb/transaction'
import { getContract } from 'thirdweb/contract'
import { toWei } from 'thirdweb/utils'
import { liskSepolia } from 'panna-sdk'

export async function plantSeed(client: any, account: any) {
  const tx = prepareContractCall({
    contract: getContract({
      client,
      chain: liskSepolia,
      address: LISK_GARDEN_CONTRACT_ADDRESS,
    }),
    method: 'function plantSeed() payable returns (uint256)',
    params: [],
    value: toWei(PLANT_PRICE), // 0.001 ETH
  })

  const result = await sendTransaction({ account, transaction: tx })
  await waitForReceipt(result) // Wait for confirmation
  return result
}

export async function waterPlant(client: any, account: any, plantId: bigint) {
  const tx = prepareContractCall({
    contract: getContract({ client, chain: liskSepolia, address: LISK_GARDEN_CONTRACT_ADDRESS }),
    method: 'function waterPlant(uint256 plantId)',
    params: [plantId],
  })
  const result = await sendTransaction({ account, transaction: tx })
  await waitForReceipt(result)
  return result
}
```

### Read Operations (lib/contract.ts)
```typescript
import { readContract } from 'thirdweb/transaction'

export async function getPlant(client: any, plantId: bigint): Promise<Plant> {
  const contract = getContract({
    client,
    chain: liskSepolia,
    address: LISK_GARDEN_CONTRACT_ADDRESS,
  })

  const rawPlant = await readContract({
    contract,
    method: 'function getPlant(uint256 plantId) view returns (uint256 id, address owner, uint8 stage, uint256 plantedDate, uint256 lastWatered, uint8 waterLevel, bool exists, bool isDead)',
    params: [plantId],
  })
  return parsePlantData(rawPlant)
}

export async function getUserPlants(client: any, userAddress: string): Promise<bigint[]> {
  const contract = getContract({ client, chain: liskSepolia, address: LISK_GARDEN_CONTRACT_ADDRESS })
  const plantIds = await readContract({
    contract,
    method: 'function getUserPlants(address user) view returns (uint256[])',
    params: [userAddress],
  })
  return plantIds.map((id: any) => BigInt(id))
}
```

## Wallet Connection UI

### Login Button (components/garden-header.tsx)
```typescript
import { LoginButton, useActiveAccount, liskSepolia } from "panna-sdk"

export default function GardenHeader() {
  const activeAccount = useActiveAccount()
  const isConnected = !!activeAccount

  return (
    <header>
      <LoginButton chain={liskSepolia} />
    </header>
  )
}
```

## Transaction Flow Pattern
1. User triggers action → Hook function called
2. Check wallet connection (`isConnected`)
3. Prepare contract call with Thirdweb
4. Send transaction via Panna account
5. Wait for receipt (`waitForReceipt`)
6. Show toast notification
7. Refresh data (`fetchPlants()`)

## Key Architecture Principles
- **Silent Refresh**: Auto-refresh without loading states (every 5s)
- **Sequential Updates**: Avoid nonce conflicts in scheduler
- **Optimistic UI**: Client-side calculations for water levels
- **Error Handling**: Try-catch with toast notifications
- **Type Safety**: TypeScript interfaces for all contract data
