import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

const seedData = [
  {
    title: 'Memulai Bisnis Online dari Nol',
    description: 'Panduan lengkap untuk memulai bisnis online dengan modal minim. Mencakup riset pasar, pemilihan platform, strategi marketing, dan tips mengelola keuangan bisnis kecil.',
    genre: 'Bisnis',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
    status: Status.published,
    publishedAt: new Date('2024-01-15T09:00:00Z'),
  },
  {
    title: 'Panduan Investasi Saham Pemula',
    description: 'Dasar-dasar investasi saham untuk pemula: cara membaca laporan keuangan, analisis fundamental vs teknis, diversifikasi portofolio, dan menghindari kesalahan umum investor baru.',
    genre: 'Keuangan',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    status: Status.published,
    publishedAt: new Date('2024-02-20T10:30:00Z'),
  },
  {
    title: 'Resep Masakan Nusantara Lengkap',
    description: 'Kumpulan 50+ resep masakan tradisional Indonesia dari Sabang sampai Merauke. Dilengkapi tips memasak, substitusi bahan, dan sejarah di balik setiap hidangan.',
    genre: 'Kuliner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    status: Status.published,
    publishedAt: new Date('2024-03-10T08:15:00Z'),
  },
  {
    title: 'Tips Produktivitas Kerja Remote',
    description: 'Strategi efektif bekerja dari rumah: manajemen waktu, setup workspace ergonomis, teknik Pomodoro, komunikasi tim virtual, dan menjaga work-life balance.',
    genre: 'Lifestyle',
    thumbnailUrl: 'https://images.unsplash.com/photo-1521791136064-7986c292241b?w=800',
    status: Status.published,
    publishedAt: new Date('2024-04-05T14:00:00Z'),
  },
  {
    title: 'Belajar React untuk Pemula',
    description: 'Tutorial step-by-step belajar React dari nol: komponen, props, state, hooks, routing, dan deployment. Cocok untuk developer yang baru migrasi dari vanilla JS.',
    genre: 'Teknologi',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    status: Status.draft,
    publishedAt: null,
  },
  {
    title: 'Strategi Marketing Digital 2024',
    description: 'Tren marketing digital terbaru: SEO, content marketing, social media ads, email marketing, influencer marketing, dan pengukuran ROI dengan Google Analytics 4.',
    genre: 'Bisnis',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    status: Status.published,
    publishedAt: new Date('2024-05-12T11:00:00Z'),
  },
  {
    title: 'Manajemen Keuangan Pribadi',
    description: 'Cara mengelola uang dengan bijak: budgeting 50/30/20, dana darurat, investasi jangka panjang, asuransi, dan perencanaan pensiun dini.',
    genre: 'Keuangan',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
    status: Status.draft,
    publishedAt: null,
  },
  {
    title: 'Wisata Tersembunyi di Jawa Timur',
    description: 'Destinasi wisata off-the-beaten-path di Jawa Timur: air terjun tersembunyi, pantai virgin, gunung non-vulkanik, dan desa budaya yang belum ramai dikunjungi wisatawan.',
    genre: 'Travel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800',
    status: Status.published,
    publishedAt: new Date('2024-06-18T07:30:00Z'),
  },
  {
    title: 'Dasar-Dasar Fotografi Mobile',
    description: 'Tips fotografi hanya dengan smartphone: komposisi, pencahayaan, editing dengan aplikasi gratis, mode manual, dan trik fotografi malam hari.',
    genre: 'Hobi',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
    status: Status.draft,
    publishedAt: null,
  },
  {
    title: 'Membangun Kebiasaan Sehat',
    description: 'Panduan membangun kebiasaan sehat yang bertahan: mikro-kebiasaan, habit stacking, environment design, tracking progress, dan mengatasi plateau motivasi.',
    genre: 'Kesehatan',
    thumbnailUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    status: Status.published,
    publishedAt: new Date('2024-07-22T16:45:00Z'),
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  for (const content of seedData) {
    const existing = await prisma.content.findFirst({
      where: { title: content.title },
    });

    if (existing) {
      console.log(`⏭️  Skipping "${content.title}" (already exists)`);
      continue;
    }

    await prisma.content.create({ data: content });
    console.log(`✅ Created: "${content.title}" [${content.status}]`);
  }

  const count = await prisma.content.count();
  console.log(`\n🎉 Seed completed! Total contents: ${count}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });