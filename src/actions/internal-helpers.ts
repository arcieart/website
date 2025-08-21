"use server";

import { Collections } from "@/constants/Collections";
import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { DBProduct, ProductImage } from "@/types/product";

/**
 * Migration action to convert old `images[]` field to new `imageMapping[]` schema
 * and remove the backwards compatibility `images` field from all products.
 * 
 * This action:
 * 1. Queries all products from Firestore
 * 2. For each product with old `images` field, creates `imageMapping` from those URLs
 * 3. Removes the old `images` field
 * 4. Updates products in batches for efficiency
 */
/*
 async function migrateImagesToImageMapping() {
  try {
    console.log("Starting migration from images[] to imageMapping[]...");
    
    // Get all products from Firestore
    const snapshot = await db.collection(Collections.Products).get();
    
    if (snapshot.empty) {
      console.log("No products found to migrate.");
      return { success: true, migratedCount: 0, message: "No products found" };
    }

    const productsToMigrate: { id: string; data: DBProduct }[] = [];
    
    // Identify products that need migration
    snapshot.forEach((docSnapshot) => {
      const product = { id: docSnapshot.id, ...docSnapshot.data() } as DBProduct;
      
      // Check if product has old images field and needs migration
      if (product.images && product.images.length > 0) {
        productsToMigrate.push({ id: docSnapshot.id, data: product });
      }
    });

    if (productsToMigrate.length === 0) {
      console.log("No products with old images field found to migrate.");
      return { success: true, migratedCount: 0, message: "No products need migration" };
    }

    console.log(`Found ${productsToMigrate.length} products to migrate.`);

    // Process migration in batches (Firestore batch limit is 500)
    const batchSize = 400; // Keep some buffer
    let migratedCount = 0;
    let batchCount = 0;

    for (let i = 0; i < productsToMigrate.length; i += batchSize) {
      const batch = db.batch();
      const currentBatch = productsToMigrate.slice(i, i + batchSize);
      
      batchCount++;
      console.log(`Processing batch ${batchCount}, products ${i + 1}-${Math.min(i + batchSize, productsToMigrate.length)}`);

      currentBatch.forEach(({ id, data: product }) => {
        const productRef = db.collection(Collections.Products).doc(id);
        
        // Create imageMapping from old images array
        const imageMapping: ProductImage[] = product.images!.map((imageUrl) => ({
          url: imageUrl,
          // No customization mapping for migrated images since they're from the old schema
          customizationMapping: {} as Record<string, string>
        }));

        // Prepare update data: add imageMapping and remove images field
        const updateData = {
          imageMapping: imageMapping,
          // Remove the old images field using admin.firestore.FieldValue.delete()
          images: FieldValue.delete(),
        };

        batch.update(productRef, updateData);
        migratedCount++;
      });

      // Commit the batch
      await batch.commit();
      console.log(`Batch ${batchCount} committed successfully.`);
    }

    console.log(`Migration completed successfully! Migrated ${migratedCount} products.`);
    
    return {
      success: true,
      migratedCount,
      message: `Successfully migrated ${migratedCount} products from images[] to imageMapping[]`
    };

  } catch (error) {
    console.error("Migration failed:", error);
    return {
      success: false,
      migratedCount: 0,
      message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}


export async function checkMigrationStatus() {
  try {
    const snapshot = await db.collection(Collections.Products).get();
    
    let totalProducts = 0;
    let productsWithOldImages = 0;
    let productsWithImageMapping = 0;
    
    snapshot.forEach((docSnapshot) => {
      const product = docSnapshot.data() as DBProduct;
      totalProducts++;
      
      if (product.images && product.images.length > 0) {
        productsWithOldImages++;
      }
      
      if (product.imageMapping && product.imageMapping.length > 0) {
        productsWithImageMapping++;
      }
    });
    
    return {
      totalProducts,
      productsWithOldImages,
      productsWithImageMapping,
      migrationNeeded: productsWithOldImages > 0
    };
    
  } catch (error) {
    console.error("Failed to check migration status:", error);
    throw error;
  }
}
*/