'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '@/lib/utils'

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        'relative h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 shadow-inner',
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          'h-full flex-1 transition-all duration-500 ease-out rounded-full',
          value && value >= 100 
            ? 'bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400'
            : value && value >= 60
            ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400'
            : value && value >= 30
            ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400'
            : 'bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400'
        )}
        style={{ 
          width: `${Math.min(value || 0, 100)}%`,
          transform: 'none'
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }