import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";

export async function POST(req: NextRequest) {
    const { content, userid, blogid } = await req.json();

    try {

        const userExists = await prisma.user.findUnique({
            where: {id: userid}
        })

        if(!userExists){
            return NextResponse.json(
                {message: "user doesn't exist"},
                {status: 404}
            )
        }

        const blogExists = await prisma.blog.findUnique({
            where: {id: blogid}
        })

        if(!blogExists){
            return NextResponse.json(
                {message: "blog doesn't exist"},
                {status: 404}
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