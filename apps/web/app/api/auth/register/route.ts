import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { prisma } from "@repo/db"

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();

    if (!username || !password) {
        return NextResponse.json(
            { message: "missing field" },
            { status: 400 }
        );
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { username: username }
        });
        if (existingUser) {
            return NextResponse.json(
                { message: 'user already exists' },
                { status: 400 }
            )
        }
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword,
            },
        })

        return NextResponse.json(
            { message: 'user created successfully' },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: 'internal server error: ', error },
            { status: 500 }
        )
    }
}
