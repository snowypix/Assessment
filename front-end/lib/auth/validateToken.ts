import { cookies } from "next/headers";
import { jwtVerify, JWTPayload } from "jose";
import { NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export interface JwtPayload extends JWTPayload {
    [key: string]: any;
}

export async function validateToken(token?: string): Promise<boolean> {
    if (!token) return false;

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        await jwtVerify(token, secret);
        return true;
    } catch (err) {
        return false;
    }
}

export async function getClaimsFromToken(): Promise<JwtPayload | null> {
    const cookieStore = cookies();
    const token = (await cookieStore).get("auth_token")?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as JwtPayload;
    } catch (err) {
        return null;
    }
}
