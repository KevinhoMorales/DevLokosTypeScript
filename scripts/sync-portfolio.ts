/**
 * Upsert de proyectos DevLokos Enterprise (content/portfolio-seed.json) a Firestore `portfolio`.
 *
 * Uso: npx tsx scripts/sync-portfolio.ts
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { FieldValue } from 'firebase-admin/firestore';
import { loadEnvFiles } from './load-env';

loadEnvFiles();

type SeedItem = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string | null;
  technologies: string[];
  category: string;
  projectUrl?: string | null;
  caseStudyUrl?: string | null;
  isPublished: boolean;
  order: number;
};

async function main() {
  if (!process.env.FIREBASE_ADMIN_SDK_KEY?.trim()) {
    throw new Error(
      'FIREBASE_ADMIN_SDK_KEY no está definido. Descoméntalo/configúralo en .env.local (JSON del service account) y vuelve a ejecutar npm run sync:portfolio.'
    );
  }

  const { getFirestore } = await import('../src/lib/firebase-admin');
  const { getPortfolioRef } = await import('../src/lib/firestore-helpers');

  const seedPath = resolve(process.cwd(), 'content/portfolio-seed.json');
  const items = JSON.parse(readFileSync(seedPath, 'utf8')) as SeedItem[];
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('portfolio-seed.json vacío o inválido');
  }

  const db = getFirestore();
  const ref = getPortfolioRef(db);
  let upserted = 0;

  for (const item of items) {
    if (!item.id || !item.title) {
      console.warn('Skip item sin id/title', item);
      continue;
    }
    const payload = {
      title: item.title,
      description: item.description || '',
      thumbnailUrl: item.thumbnailUrl || null,
      technologies: Array.isArray(item.technologies) ? item.technologies : [],
      category: item.category || '',
      projectUrl: item.projectUrl || null,
      caseStudyUrl: item.caseStudyUrl || null,
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

  console.log(`Synced ${upserted} portfolio items.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
