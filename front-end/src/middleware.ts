import { NextRequest, NextResponse } from "next/server";
import { validateToken } from "../lib/auth/validateToken";
import jwt from "jsonwebtoken"; // if not already installed: npm i jsonwebtoken
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
// This assumes your JWT has a `role` claim, e.g. { sub: "123", role: "Admin" }
export async function middleware(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value;
    const isValid = await validateToken(token);
    if (!isValid || !token) {
        const res = NextResponse.redirect(new URL("/login", req.url));
        res.cookies.set("auth_token", "", { maxAge: 0 });
        return res;
    }

    try {
        const decoded = jwt.decode(token) as { role?: string };

        const claims = normalizeClaims(decoded);

        if (claims.role !== "Planner") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    } catch {
        const res = NextResponse.redirect(new URL("/login", req.url));
        res.cookies.set("auth_token", "", { maxAge: 0 });
        return res;
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
