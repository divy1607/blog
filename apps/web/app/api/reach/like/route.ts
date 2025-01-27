import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({
                message: "unauthorized"
            }, { status: 404 })
        }

        const userId = Number(session.user.id);
        const { blogId, commentId } = await req.json();

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

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get("blogId");
    const commentId = searchParams.get("commentId");

    try {
        if (!blogId && !commentId) {
            return NextResponse.json(
                { message: "Either blogId or commentId must be provided." },
                { status: 400 }
            );
        }

        if (blogId && commentId) {
            return NextResponse.json(
                { message: "You can only provide one of blogId or commentId." },
                { status: 400 }
            );
        }

        if (blogId) {
            const blogLikes = await prisma.like.findMany({
                where: { blogId: Number(blogId) },
                include: {
                    user: {
                        select: {
                            username: true,
                        }
                    }
                }
            });

            return NextResponse.json(
                {
                    message: "Likes for blog:",
                    likes: blogLikes.map((like) => like.user.username)
                },
                { status: 200 }
            );
        }

        if (commentId) {
            const commentLikes = await prisma.like.findMany({
                where: { commentId: Number(commentId) },
                include: {
                    user: {
                        select: {
                            username: true,
                        }
                    }
                }
            });

            return NextResponse.json(
                {
                    message: "Likes for comment:",
                    likes: commentLikes.map((like) => like.user.username)
                },
                { status: 200 }
            );
        }

    } catch (error: any) {
        return NextResponse.json(
            { message: "Internal server error: ", error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({
                message: "unauthorized"
            }, { status: 404 });
        }

        const userId = Number(session.user.id);
        const { blogId, commentId } = await req.json();

        if (!blogId && !commentId) {
            return NextResponse.json(
                { message: "Either blogId or commentId is required to unlike." },
                { status: 400 }
            );
        }

        if (blogId && commentId) {
            return NextResponse.json(
                { message: "You can only unlike a blog or a comment at one time." },
                { status: 400 }
            );
        }

        let likeToDelete;
        if (blogId) {
            likeToDelete = await prisma.like.findFirst({
                where: {
                    userId,
                    blogId,
                },
            });
        } else if (commentId) {
            likeToDelete = await prisma.like.findFirst({
                where: {
                    userId,
                    commentId,
                },
            });
        }

        if (!likeToDelete) {
            return NextResponse.json(
                { message: "You haven't liked this blog or comment." },
                { status: 404 }
            );
        }

        await prisma.like.delete({
            where: {
                id: likeToDelete.id,
            },
        });

        return NextResponse.json(
            { message: "Like removed successfully." },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Error unliking blog/comment:", error);

        return NextResponse.json(
            { message: "Internal server error.", error: error.message },
            { status: 500 }
        );
    }
}
