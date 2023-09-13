export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/admin-dashboard/:path*",
    "/user-dashboard/:path*",
    "/shipping",
    "/order-complete",
  ],
};
