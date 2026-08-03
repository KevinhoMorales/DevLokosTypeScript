/**
 * Upsert de productos (content/products-seed.json) a Firestore `products`.
 *
 * Uso: npx tsx scripts/seed-products.ts
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { FieldValue } from 'firebase-admin/firestore';
import { loadEnvFiles } from './load-env';

loadEnvFiles();

type StoreLink = { label: string; url: string };

type SeedProduct = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string | null;
  type: string;
  storeLinks: StoreLink[];
  isPublished: boolean;
  order: number;
};

async function main() {
  if (!process.env.FIREBASE_ADMIN_SDK_KEY?.trim()) {
    throw new Error(
      'FIREBASE_ADMIN_SDK_KEY no está definido. Descoméntalo/configúralo en .env.local (JSON del service account) y vuelve a ejecutar npm run seed:products.'
    );
  }

  const { getFirestore } = await import('../src/lib/firebase-admin');
  const { getProductsRef } = await import('../src/lib/firestore-helpers');

  const seedPath = resolve(process.cwd(), 'content/products-seed.json');
  const items = JSON.parse(readFileSync(seedPath, 'utf8')) as SeedProduct[];
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('products-seed.json vacío o inválido');
  }

  const db = getFirestore();
  const ref = getProductsRef(db);
  let upserted = 0;

  for (const item of items) {
    if (!item.id || !item.title) {
      console.warn('Skip product sin id/title', item);
      continue;
    }
    const payload = {
      title: item.title,
      description: item.description || '',
      thumbnailUrl: item.thumbnailUrl || null,
      type: item.type || 'other',
      storeLinks: Array.isArray(item.storeLinks) ? item.storeLinks : [],
      isPublished: item.isPublished !== false,
      order: typeof item.order === 'number' ? item.order : 0,
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = ref.doc(item.id);
    const existing = await docRef.get();
    if (existing.exists) {
      const { createdAt: _c, ...update } = payload;
      await docRef.set(
        { ...update, createdAt: existing.data()?.createdAt ?? FieldValue.serverTimestamp() },
        { merge: true }
      );
    } else {
      await docRef.set(payload);
    }
    upserted += 1;
    console.log(`✓ ${item.id}`);
  }

  console.log(`Seeded ${upserted} products.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
