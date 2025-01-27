import { prisma } from '@repo/db'; // Adjust based on your actual path
import BlogsPage from '../components/BlogsPage';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
    return null;
  }

  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <BlogsPage blogs={blogs} />
    </div>
  );
}
