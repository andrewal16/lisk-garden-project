'use client'

import { useMemo } from 'react'
import { useActiveAccount, usePanna } from 'panna-sdk'
import { LISK_GARDEN_V2_ADDRESS, GARDEN_TOKEN_ADDRESS } from '@/lib/contract'

/**
 * Hook to get the Panna client and active account
 * Returns client, account, and wallet connection status
 */
export function useContract() {
  const activeAccount = useActiveAccount()
  const { client } = usePanna()

  const contractInfo = useMemo(() => {
    return {
      client: client || null,
      account: activeAccount || null,
      isConnected: !!activeAccount && !!client,
      address: activeAccount?.address || null,
      liskGardenV2Address: LISK_GARDEN_V2_ADDRESS,
      gardenTokenAddress: GARDEN_TOKEN_ADDRESS,
    }
  }, [activeAccount, client])

  return contractInfo
}
