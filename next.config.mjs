// Optional CORS workaround: set NEXT_PUBLIC_USE_PROXY=true and the browser will call
// /api-proxy/* on your own origin, which Next forwards to the real API server-side.
const api = process.env.NEXT_PUBLIC_API_URL || "https://sport-api.eunglyzhia.com/api/v1";
export default {
  async rewrites() {
    return [{ source: "/api-proxy/:path*", destination: `${api.replace(/\/$/, "")}/:path*` }];
  },
};
