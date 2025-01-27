'use client';

import React, { useEffect, useState } from 'react';

export default function BlogsPage({ blogs }: { blogs: any[] }) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredBlogs, setFilteredBlogs] = useState<any[]>(blogs);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredBlogs(blogs);
      return;
    }

    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(lowercasedSearchTerm) ||
        (blog.tag || []).some((tag: string) => tag.toLowerCase().includes(lowercasedSearchTerm))
    );

    setFilteredBlogs(filtered);
  }, [searchTerm, blogs]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Blogs</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search blogs by title or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      <div className="space-y-6">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
              <p className="text-gray-700 mb-4">{blog.description}</p>
              <div className="text-sm text-gray-500 mb-4">
                {blog.tag?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {blog.tag.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => window.location.href = `/blog/${blog.id}`}
                className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
              >
                Read More
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No blogs found.</p>
        )}
      </div>
    </div>
  );
}
