'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const router = useRouter();

    const handleTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTitle(e.target.value);
    };

    const handleDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    const handleCont = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
    };

    const addTag = () => {
        if (tagInput.trim() !== '') {
            setTags((prevTags) => [...prevTags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (index: number) => {
        setTags((prevTags) => prevTags.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload = {
                title,
                description,
                content,
                tag: tags,
            };

            const response = await axios.post('http://localhost:3000/admin/api/blog', payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Blog successfully created:", response.data);
            alert("Blog created successfully!");

            setTitle('');
            setDescription('');
            setContent('');
            setTags([]);

            router.push('/admin');
        } catch (error) {
            console.error("Error creating blog:", error);
            alert("Failed to create the blog. Please try again.");
        }
    };

    return (
        <div>
            <h1>Create a New Blog</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    name="title"
                    placeholder="Title"
                    value={title}
                    onChange={handleTitle}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={description}
                    onChange={handleDesc}
                    required
                />
                <textarea
                    name="content"
                    placeholder="Content"
                    value={content}
                    onChange={handleCont}
                    required
                />
                <div>
                    <input
                        type="text"
                        placeholder="Add a tag"
                        value={tagInput}
                        onChange={handleTagInput}
                    />
                    <button type="button" onClick={addTag}>Add Tag</button>
                </div>
                <div>
                    {tags.map((tag, index) => (
                        <span key={index} style={{ marginRight: '10px' }}>
                            {tag} <button type="button" onClick={() => removeTag(index)}>x</button>
                        </span>
                    ))}
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
