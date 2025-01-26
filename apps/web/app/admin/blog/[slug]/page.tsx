"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: Promise<{ slug: number }> }) {
    const [blog, setBlog] = useState<any>(null);
    const [slug, setSlug] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState<string>("");
    const [updatedContent, setUpdatedContent] = useState<string>("");
    const [updatedDescription, setUpdatedDescription] = useState<string>("");
    const [updatedTags, setUpdatedTags] = useState<string[]>([]); 
    const [newTag, setNewTag] = useState<string>(""); 

    const router = useRouter();

    useEffect(() => {
        const fetchParams = async () => {
            const resolvedParams = await params;
            setSlug(resolvedParams.slug);
        };
        fetchParams();
    }, [params]);

    useEffect(() => {
        if (slug !== null) {
            async function extractBlog(id: number) {
                try {
                    const response = await axios.get(
                        `http://localhost:3000/admin/api/getDetails?blogId=${slug}`
                    );
                    setBlog(response.data);
                    setUpdatedTitle(response.data.blogData.title);
                    setUpdatedContent(response.data.blogData.content);
                    setUpdatedDescription(response.data.blogData.description);
                    setUpdatedTags(response.data.blogData.tag || []);
                } catch (err) {
                    console.error(err);
                }
            }

            extractBlog(slug);
        }
    }, [slug]);

    const handleUpdate = async () => {
        try {
            const payload = {
                id: Number(slug),
                title: updatedTitle,
                description: updatedDescription,
                content: updatedContent,
                tag: updatedTags, // Include updated tags in the payload
            };

            console.log("Payload:", payload);

            const response = await axios.patch(
                `http://localhost:3000/admin/api/blog`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Response:", response.data);
            setBlog(response.data);
            setIsEditing(false);

            router.push(`http://localhost:3000/admin/blog/${slug}`);
        } catch (err: any) {
            console.error("Full Error:", err.response ? err.response.data : err);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/admin/api/blog`, {
                data: { id: slug },
            });
            alert("Blog deleted successfully.");

            router.push("http://localhost:3000/admin");
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setUpdatedTitle(blog?.blogData.title);
        setUpdatedContent(blog?.blogData.content);
        setUpdatedDescription(blog?.blogData.description);
        setUpdatedTags(blog?.blogData.tag || []);
    };

    const addTag = () => {
        if (newTag.trim() !== "") {
            setUpdatedTags((prevTags) => [...prevTags, newTag.trim()]);
            setNewTag("");
        }
    };

    const removeTag = (index: number) => {
        setUpdatedTags((prevTags) => prevTags.filter((_, i) => i !== index));
    };

    if (!blog) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{isEditing ? "Edit Blog" : "Blog Details"}</h1>

            <div>
                <label>
                    Title:
                    {isEditing ? (
                        <input
                            type="text"
                            value={updatedTitle}
                            onChange={(e) => setUpdatedTitle(e.target.value)}
                        />
                    ) : (
                        <span>{blog?.blogData?.title}</span>
                    )}
                </label>
            </div>

            <div>
                <label>
                    Description:
                    {isEditing ? (
                        <input
                            type="text"
                            value={updatedDescription}
                            onChange={(e) => setUpdatedDescription(e.target.value)}
                        />
                    ) : (
                        <span>{blog?.blogData?.description}</span>
                    )}
                </label>
            </div>

            <div>
                <label>
                    Content:
                    {isEditing ? (
                        <textarea
                            value={updatedContent}
                            onChange={(e) => setUpdatedContent(e.target.value)}
                        />
                    ) : (
                        <p>{blog?.blogData?.content}</p>
                    )}
                </label>
            </div>

            <div>
                <label>
                    Tags:
                    {isEditing ? (
                        <div>
                            {updatedTags.map((tag, index) => (
                                <span key={index} style={{ marginRight: "10px" }}>
                                    {tag}{" "}
                                    <button type="button" onClick={() => removeTag(index)}>
                                        x
                                    </button>
                                </span>
                            ))}
                            <div>
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="Add a new tag"
                                />
                                <button type="button" onClick={addTag}>
                                    Add Tag
                                </button>
                            </div>
                        </div>
                    ) : (
                        <span>{blog?.blogData?.tag.join(", ")}</span>
                    )}
                </label>
            </div>

            <div>
                {isEditing ? (
                    <div>
                        <button onClick={handleUpdate}>Update</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </div>
                ) : (
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                )}
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
}
