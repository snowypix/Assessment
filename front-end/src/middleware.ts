import { NextRequest, NextResponse } from "next/server";
import { clientMiddleware } from "./clientMiddleware";
import { adminMiddleware } from "./adminMiddleware";

export async function middleware(req: NextRequest) {

    if (req.nextUrl.pathname.startsWith("/tickets")) {
        return await clientMiddleware(req);
    }

    if (req.nextUrl.pathname.startsWith("/admin")) {
        return adminMiddleware(req);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/tickets/:path*", "/admin/:path*"],
};
