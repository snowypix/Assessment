import { NextRequest, NextResponse } from "next/server";
import { validateToken } from "../lib/auth/validateToken";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value;
    const isValid = await validateToken(token);
    if (!isValid) {
        const res = NextResponse.redirect(new URL("/login", req.url));
        res.cookies.set("auth_token", "", { maxAge: 0 });
        return res;
    }

    return NextResponse.next();
}
export const config = {
    matcher: ["/admin"],
};
