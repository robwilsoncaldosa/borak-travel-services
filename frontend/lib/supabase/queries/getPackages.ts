import 'server-only'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { unstable_noStore as noStore } from 'next/cache'

export async function getPackages() {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
        .from('packages')
        .select('id,title,images,about_tour,duration_hours,inclusions')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Supabase fetch failed:', error)
        throw new Error('Failed to fetch packages from Supabase')
    }

    const rows = data ?? []

    return rows.map((pkg) => ({
        id: pkg.id,
        title: pkg.title,
        image: getValidImageUrl(pkg.images?.[0]),
        description: pkg.about_tour,
        inclusions: [
            `${pkg.duration_hours} Hours Duration`,
            ...(pkg.inclusions ?? []).slice(0, 2),
        ],
        price: 'Contact for Price',
    }))
}

// Fetch single package by id via Supabase (SSR, no cache)
export async function getPackageById(id: string) {
    noStore()
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        // Return null if not found; otherwise throw
        if (error.code === 'PGRST116') {
            return null
        }
        console.error('Supabase getPackageById failed:', error)
        throw new Error('Failed to fetch package by id from Supabase')
    }

    const pkg = data

    return {
        ...pkg,
        images: Array.isArray(pkg.images) ? pkg.images.map(getValidImageUrl) : [],
    }
}

// Helper: validate/format image URL (Cloudinary absolute or local fallback)
function getValidImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return '/Landing.jpg'

    try {
        new URL(imageUrl)
        return imageUrl
    } catch {
        if (imageUrl.startsWith('/')) {
            return imageUrl
        }
        return `/uploads/${imageUrl}`
    }
}