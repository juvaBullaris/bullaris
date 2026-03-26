/** @type {import('next').NextConfig} */
const nextConfig = {
  // Provide placeholder values so Supabase client doesn't throw during `next build`
  // when real env vars aren't available (e.g. in CI without a Supabase project).
  // These are overridden by actual env vars at runtime.
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key',
  },
  transpilePackages: ['@bullaris/db', '@bullaris/danish-tax', '@bullaris/nudge-engine'],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'image.mux.com' },
    ],
  },
}

module.exports = nextConfig
