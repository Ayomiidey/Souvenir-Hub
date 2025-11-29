import  prisma  from '@/lib/prisma';
import { notFound } from 'next/navigation';

// Revalidate every 24 hours (content changes infrequently)
export const revalidate = 86400;

export default async function AboutUsPage() {
  // Fetch About Us content from the database
  const about = await prisma.aboutUs.findFirst({ orderBy: { createdAt: 'desc' } });

  if (!about || !about.content) {
    return notFound();
  }

  return (
    <section className="min-h-[40vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-2 sm:px-4">
  <div className="w-full max-w-8xl bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 sm:p-12 border border-gray-100 dark:border-gray-800">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-900 dark:text-white">About Us</h1>
        <div className="prose prose-lg max-w-none break-words text-gray-800 dark:text-gray-200 mx-auto" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: about.content }} />
      </div>
    </section>
  );
}
