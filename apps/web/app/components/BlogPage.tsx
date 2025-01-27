'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

type BlogPageProps = {
  blog: {
    id: number;
    title: string;
    description: string;
    content: string;
    tag: string[];
    createdAt: Date;
    updatedAt: Date;
  };
};

type Comment = {
  id: number;
  content: string;
  user: {
    username: string;
  };
  likeCount: number;
};

export default function BlogPage({ blog }: BlogPageProps) {
  const [likeCount, setLikeCount] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentLikes, setCommentLikes] = useState<{ [key: number]: number }>({});
  const [blogLiked, setBlogLiked] = useState<boolean>(false);
  const [commentLiked, setCommentLiked] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchLikesAndComments = async () => {
      try {
        const { data: blogLikesData } = await axios.get(`/api/reach/like?blogId=${blog.id}`);
        setLikeCount(blogLikesData.likes);

        const { data: commentsData } = await axios.get(`/api/reach/comment?blogId=${blog.id}`);
        setComments(commentsData);

        const commentLikesData = await Promise.all(
          commentsData.map(async (comment: Comment) => {
            const { data } = await axios.get(`/api/reach/like?commentId=${comment.id}`);
            return { commentId: comment.id, likeCount: data.likes.length };
          })
        );

        const commentLikesMap = commentLikesData.reduce(
          (acc: { [key: number]: number }, { commentId, likeCount }: { commentId: number; likeCount: number }) => {
            acc[commentId] = likeCount;
            return acc;
          },
          {}
        );

        setCommentLikes(commentLikesMap);
      } catch (error) {
        console.error('Error fetching likes and comments:', error);
      }
    };

    fetchLikesAndComments();
  }, [blog.id]);

  const handleLike = async () => {
    try {
      await axios.post('/api/reach/like', { blogId: blog.id });
      setLikeCount((prev) => prev + 1);
      setBlogLiked(true);
    } catch (error) {
      console.error('Error liking the blog:', error);
    }
  };

  const handleUnlike = async () => {
    try {
      await axios.delete('/api/reach/like', { data: { blogId: blog.id } });
      setLikeCount((prev) => prev - 1);
      setBlogLiked(false);
    } catch (error) {
      console.error('Error unliking the blog:', error);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) {
      alert('Comment cannot be empty!');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await axios.post('/api/reach/comment', { blogid: blog.id, content: comment });
      setComments((prev) => [...prev, data.comment]);
      setComment('');
    } catch (error) {
      console.error('Error adding a comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentLike = async (commentId: number) => {
    try {
      await axios.post('/api/reach/like', { commentId });
      setCommentLikes((prev) => ({
        ...prev,
        [commentId]: (prev[commentId] || 0) + 1,
      }));
      setCommentLiked((prev) => ({ ...prev, [commentId]: true }));
    } catch (error) {
      console.error('Error liking the comment:', error);
    }
  };

  const handleCommentUnlike = async (commentId: number) => {
    try {
      await axios.delete('/api/reach/like', { data: { commentId } });
      setCommentLikes((prev) => ({
        ...prev,
        [commentId]: (prev[commentId] || 0) - 1,
      }));
      setCommentLiked((prev) => ({ ...prev, [commentId]: false }));
    } catch (error) {
      console.error('Error unliking the comment:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow">
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-700 mb-6">{blog.description}</p>
      <div className="text-sm text-gray-500 mb-4">
        {blog.tag.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg mr-2 text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="text-gray-800 mb-6">{blog.content}</p>

      <div className="flex items-center gap-4">
        <button
          onClick={blogLiked ? handleUnlike : handleLike}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {blogLiked ? `Unlike (${likeCount})` : `Like (${likeCount})`}
        </button>

        <div className="flex-1">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <button
              onClick={handleComment}
              disabled={isSubmitting}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-2xl font-semibold mb-4">Comments</h3>
        {comments.map((comment) => (
          <div key={comment.id} className="border-t pt-4">
            <p className="text-gray-800">{comment.content}</p>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={
                  commentLiked[comment.id]
                    ? () => handleCommentUnlike(comment.id)
                    : () => handleCommentLike(comment.id)
                }
                className="text-blue-600 hover:text-blue-700"
              >
                {commentLiked[comment.id]
                  ? `Unlike (${commentLikes[comment.id] || 0})`
                  : `Like (${commentLikes[comment.id] || 0})`}
              </button>
              <span className="text-sm text-gray-500">by {comment.user?.username}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
