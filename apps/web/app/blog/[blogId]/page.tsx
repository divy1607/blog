import { prisma } from '@repo/db';
import BlogPage from '../../components/BlogPage';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export default async function Page({ params }: { params: Promise<{ blogId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-bold">You must be logged in to view this page.</h1>
      </div>
    );
  }

  const blogId = Number((await params).blogId);

  if (isNaN(blogId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-bold">Invalid Blog ID</h1>
      </div>
    );
  }

  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
  });

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-bold">Blog not found.</h1>
      </div>
    );
  }

  return <BlogPage blog={blog} />;
}
