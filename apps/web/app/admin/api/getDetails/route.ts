import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const blogId = searchParams.get("blogId");

        if (!blogId) {
            return NextResponse.json(
                { message: "Blog ID is required to fetch data." },
                { status: 400 }
            );
        }

        const blogData = await prisma.blog.findUnique({
            where: { id: parseInt(blogId) },
            include: {
                likes: { include: { user: true } },
                comments: {
                    include: {
                        user: true,
                        replies: { include: { user: true } },
                    },
                },
            },
        });

        if (!blogData) {
            return NextResponse.json(
                { message: "Blog not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({ blogData }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching blog data:", error);

        return NextResponse.json(
            { message: "Internal server error.", error: error.message },
            { status: 500 }
        );
    }
}
