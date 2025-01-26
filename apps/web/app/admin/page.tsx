import { prisma } from "@repo/db";

export default async function AdminDashboard() {
  const blogs = await prisma.blog.findMany();

  return (
    <div className="flex">
      <h1>Hi, this is an admin dashboard</h1>
      <h2>Blogs that are posted are:</h2>
      <ul>
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <li key={blog.id} className="mb-2">
              {blog.title}{" "}
              <a
                href={`http://localhost:3000/admin/blog/${blog.id}`}
                className="text-blue-500 underline"
              >
                Edit
              </a>
            </li>
          ))
        ) : (
          <p>No blogs posted yet</p>
        )}
      </ul>
      <div>
        <a href="http://localhost:3000/admin/blog/post"> create blog </a>
      </div>
    </div>
  );
}
