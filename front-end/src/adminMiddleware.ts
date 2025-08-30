import { NextRequest, NextResponse } from "next/server";
import { validateToken } from "../lib/auth/validateToken";
import jwt from "jsonwebtoken";
function normalizeClaims(decoded: any) {
    return {
        sub: decoded.sub,
        name:
            decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ??
            decoded.name,
        role:
            decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
            decoded.role,
        permissions: decoded.permission ?? [],
    };
}
export async function adminMiddleware(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value;
    // const isValid = await validateToken(token);
    const { pathname, search } = req.nextUrl;

    if (!token) {

        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", pathname + search);

        const res = NextResponse.redirect(loginUrl);
        return res;
    }

    try {
        const decoded = jwt.decode(token) as { role?: string };

        const claims = normalizeClaims(decoded);

        if (claims.role !== "Planner") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    } catch {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", pathname + search);

        const res = NextResponse.redirect(loginUrl);
        res.cookies.set("auth_token", "", { maxAge: 0 });
        return res;
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin", "/admin/:path*"],
};
