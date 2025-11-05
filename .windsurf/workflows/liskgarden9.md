---
description: Lisk Garden DApp - Project Configuration & Setup
auto_execution_mode: 1
---

# Project Configuration & Setup

## TypeScript Configuration (tsconfig.json)
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "target": "ES6",
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]  // Path alias for imports
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Next.js Configuration (next.config.mjs)
```javascript
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,  // For rapid development
  },
  images: {
    unoptimized: true,  // No image optimization
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',  // Required for wallet popups
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
        ],
      },
    ]
  },
}
```
**Critical**: CORS headers are required for Web3 wallet popup authentication.

## PostCSS Configuration (postcss.config.mjs)
```javascript
const config = {
  plugins: {
    '@tailwindcss/postcss': {},  // Tailwind v4 uses PostCSS plugin
  },
}
```

## shadcn/ui Configuration (components.json)
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",  // Design style variant
  "rsc": true,  // React Server Components support
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,  // Use CSS variables for theming
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

## Environment Variables (.env.local)
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xf44adEdec3f5E7a9794bC8E830BE67e4855FA8fF
NEXT_PUBLIC_PANNA_CLIENT_ID=your_panna_client_id
NEXT_PUBLIC_PANNA_PARTNER_ID=your_panna_partner_id
```

## NPM Scripts
```json
{
  "scripts": {
    "dev": "next dev",           // Start dev server
    "build": "next build",       // Production build
    "start": "next start",       // Start production server
    "lint": "eslint ."          // Run ESLint
  }
}
```

## Project Structure
```
lisk-garden-dapp/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Main garden page
│   ├── layout.tsx           # Root layout with providers
│   └── globals.css          # Global styles + Tailwind
├── components/              # React components
│   ├── ui/                  # shadcn/ui components (18 files)
│   ├── garden-header.tsx    # Header with wallet
│   ├── garden-grid.tsx      # Plant grid
│   ├── plant-card.tsx       # Individual plant
│   ├── plant-details-modal.tsx
│   ├── plant-seed-modal.tsx
│   ├── stats-sidebar.tsx
│   ├── providers.tsx        # PannaProvider + ThemeProvider
│   └── theme-provider.tsx
├── hooks/                   # Custom React hooks
│   ├── useContract.ts       # Panna client & account
│   ├── usePlants.ts         # Plant CRUD operations
│   ├── usePlantStageScheduler.ts  # Auto-sync scheduler
│   ├── use-toast.ts         # Toast notifications
│   └── use-mobile.ts        # Mobile detection
├── lib/                     # Utilities
│   ├── contract.ts          # Contract interaction functions
│   └── utils.ts             # Helper utilities (cn, etc.)
├── types/                   # TypeScript types
│   └── contracts.ts         # Contract types, ABI, constants
├── scripts/                 # Utility scripts
│   └── check-balance.js     # Check contract balance
├── public/                  # Static assets
│   ├── placeholder-logo.png
│   └── placeholder-user.jpg
├── package.json
├── tsconfig.json
├── next.config.mjs
├── postcss.config.mjs
├── components.json
└── README.md
```

## Key Configuration Notes

1. **Tailwind v4**: Uses new `@tailwindcss/postcss` plugin instead of config file
2. **Path Aliases**: `@/*` maps to project root for clean imports
3. **CORS Headers**: Essential for Web3 wallet authentication popups
4. **CSS Variables**: Theme colors defined in globals.css using oklch color space
5. **Server Components**: RSC enabled but most components use 'use client' for interactivity
6. **Image Optimization**: Disabled for simplicity (can enable for production)
