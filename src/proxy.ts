import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Note: API routes (/api/*) are NOT protected here because they have their own
// explicit auth checks that return proper JSON 401 responses. Clerk's auth.protect()
// rewrites unauthenticated requests to /_not-found (HTML 200), which masks the
// actual auth boundary for API consumers.
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
}, {
  authorizedParties: [
    "https://puravidaminds.vercel.app",
    "http://localhost:3000",
  ],
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
