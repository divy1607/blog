import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";

export async function POST(req: NextRequest) {
    try {
        const { title, description, content, tag } = await req.json();

        if (!title || !description || !content || !tag) {
            return NextResponse.json(
                { message: "All fields (title, description, content, tag) are required." },
                { status: 400 }
            );
        }

        const existingBlog = await prisma.blog.findUnique({
            where: { title: title }
        })

        if (existingBlog) {
            return NextResponse.json(
                { message: "blog with this title already exists" },
                { status: 400 }
            )
        }

        const newBlog = await prisma.blog.create({
            data: {
                title: title,
                description: description,
                content: content,
                tag: tag,
            },
        });

        return (NextResponse.json(
            { message: "Blog created successfully!", blog: newBlog },
            { status: 201 }
        )
        )
    } catch (error: any) {

        return NextResponse.json(
            { message: "Internal server error: ", error: error.message },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const { id, title, description, content, tag } = await req.json();

        console.log("Received payload:", { id, title, description, content, tag });

        if (!id || (!title && !description && !content && !tag)) {
            return NextResponse.json(
                { message: "Blog ID and at least one field to update are required." },
                { status: 400 }
            );
        }

        if (typeof id !== "number") {
            return NextResponse.json(
                { message: "Blog ID must be a valid number." },
                { status: 400 }
            );
        }

        if (tag && !Array.isArray(tag)) {
            return NextResponse.json(
                { message: "`tag` must be an array." },
                { status: 400 }
            );
        }

        if (title) {
            const existingBlog = await prisma.blog.findUnique({
                where: { title: title },
            });

            if (existingBlog && existingBlog.id !== id) {
                return NextResponse.json(
                    { message: "A blog with this title already exists." },
                    { status: 400 }
                );
            }
        }

        const updatedBlog = await prisma.blog.update({
            where: {
                id: id,
            },
            data: {
                ...(title && { title }),
                ...(description && { description }),
                ...(content && { content }),
                ...(tag && { tag: { set: tag } }),
            },
        });

        return NextResponse.json(
            { message: "Blog updated successfully!", blog: updatedBlog },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error updating blog:", error);

        return NextResponse.json(
            { message: "Internal server error.", error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                { message: "Please provide a valid blog ID." },
                { status: 400 }
            );
        }

        const deletedBlog = await prisma.blog.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json(
            { message: "Blog deleted successfully.", blog: deletedBlog },
            { status: 200 }
        );
    } catch (e: any) {

        return NextResponse.json(
            { message: "Internal server error.", error: e.message },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const response = await prisma.blog.findMany();

        return (
            NextResponse.json(
                { response },
                { status: 200 }
            )
        )

    } catch (error) {
        return (
            NextResponse.json(
                { message: "internal server error: ", error },
                { status: 500 }
            )
        )
    }
}