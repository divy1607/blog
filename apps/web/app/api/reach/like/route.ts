import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";

export async function POST(req: NextRequest) {
    try {
        
        const { userId, blogId, commentId } = await req.json();

        if (!blogId && !commentId) {
            return NextResponse.json(
                { message: "Either blogId or commentId is required to like." },
                { status: 400 }
            );
        }

        if (blogId && commentId) {
            return NextResponse.json(
                { message: "You can only like a blog or a comment at one time." },
                { status: 400 }
            );
        }

        const existingLike = await prisma.like.findFirst({
            where: {
                userId,
                OR: [{ blogId: blogId || undefined }, { commentId: commentId || undefined }],
            },
        });

        if (existingLike) {
            return NextResponse.json(
                { message: "You have already liked this item." },
                { status: 400 }
            );
        }

        if (blogId) {
            const blogExists = await prisma.blog.findUnique({ where: { id: blogId } });

            if (!blogExists) {
                return NextResponse.json(
                    { message: "Blog does not exist." },
                    { status: 404 }
                );
            }

            const like = await prisma.like.create({
                data: { userId, blogId },
            });

            return NextResponse.json(
                { message: "Blog liked successfully!", like },
                { status: 201 }
            );
        }

        if (commentId) {
            const commentExists = await prisma.comment.findUnique({ where: { id: commentId } });

            if (!commentExists) {
                return NextResponse.json(
                    { message: "Comment does not exist." },
                    { status: 404 }
                );
            }

            const like = await prisma.like.create({
                data: { userId, commentId },
            });

            return NextResponse.json(
                { message: "Comment liked successfully!", like },
                { status: 201 }
            );
        }
    } catch (error: any) {
        console.error("Error liking blog/comment:", error);

        return NextResponse.json(
            { message: "Internal server error.", error: error.message },
            { status: 500 }
        );
    }
}
