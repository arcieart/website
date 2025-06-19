import { MetadataRoute } from 'next'
import { BaseCategories } from '@/data/categories'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { Collections } from '@/constants/Collections'
import { DBProduct } from '@/types/product'

// Cache the sitemap for 1 week (604800 seconds)
export const revalidate = 604800

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://arcie.art'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = BaseCategories.map((category) => ({
    url: `${baseUrl}/products/${category.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Product pages - fetch from Firebase
  let productPages: MetadataRoute.Sitemap = []
  
  try {
    const productsRef = collection(db, Collections.Products)
    const availableProductsQuery = query(
      productsRef,
      where('available', '==', true)
    )
    const snapshot = await getDocs(availableProductsQuery)
    
    productPages = snapshot.docs.map((doc) => {
      const product = { id: doc.id, ...doc.data() } as DBProduct
      return {
        url: `${baseUrl}/products/${product.categoryId}/${product.slug}`,
        lastModified: new Date(product.createdAt),
        changeFrequency: 'weekly' as const,
        priority: product.isBestSeller ? 0.9 : 0.7,
      }
    })
  } catch (error) {
    console.error('Error fetching products for sitemap:', error)
    // Continue without product pages if there's an error
  }

  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
  ]
}