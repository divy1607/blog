import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { message: "unauthorized" },
            { status: 404 }
        )
    }

    const userid = Number(session.user.id);
    const { content, blogid } = await req.json();

    try {

        const userExists = await prisma.user.findUnique({
            where: { id: userid }
        })

        if (!userExists) {
            return NextResponse.json(
                { message: "user doesn't exist" },
                { status: 404 }
            )
        }

        const blogExists = await prisma.blog.findUnique({
            where: { id: blogid }
        })

        if (!blogExists) {
            return NextResponse.json(
                { message: "blog doesn't exist" },
                { status: 404 }
            )
        }

        const newComment = await prisma.comment.create({
            data: {
                content: content,
                userId: userid,
                blogId: blogid
            }
        })

        return NextResponse.json(
            { message: "new comment added on blog", comment: newComment },
            { status: 201 }
        )

    } catch (error: any) {
        return NextResponse.json(
            { message: "internal server error: ", error: error.message },
            { status: 500 }
        )
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get('blogId');

    if (!blogId) {
        return NextResponse.json(
            { message: 'blogId query parameter is required' },
            { status: 400 }
        );
    }

    try {
        const comments = await prisma.comment.findMany({
            where: { blogId: Number(blogId) },
            include: {
                user: { select: { username: true } }, 
            },
        });

        return NextResponse.json(comments, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching comments:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}