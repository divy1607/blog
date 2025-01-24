import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";

export async function POST (req: NextRequest) {
    const {content, userId, commentId} = await req.json();

    try {
        const userExists = await prisma.user.findUnique({
            where: {id: userId}
        })

        if(!userExists){
            return NextResponse.json(
                {message: "user doesn't exist"},
                {status: 404}
            )
        }

        const commentExists = await prisma.comment.findUnique({
            where: {id: commentId}
        })

        if(!commentExists){
            return NextResponse.json(
                {message: "comment doesn't exist"},
                {status: 404}
            )
        }

        const newReply = await prisma.reply.create({
            data: {
                content: content,
                userId: userId,
                commentId: commentId
            }
        })

        return NextResponse.json(
            {message: `new reply by ${userExists.username}: `, newReply}
        )
    } catch (error: any) {
        return NextResponse.json(
            {message: "internal server error: ", error: error.message},
            {status: 500}
        )
    }
}