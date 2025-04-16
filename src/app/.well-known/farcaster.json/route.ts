import { NextResponse } from 'next/server';

// Get the base URL from environment variables, default to localhost for development
const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

// Define the Farcaster MiniApp manifest content
const manifest = {
  name: "Rupture Labs Games", // Your MiniApp's name
  description: "Play Unity WebGL games directly on Farcaster.", // A brief description
  icon: `${appUrl}/icon.png`, // URL to your app's icon (ensure public/icon.png exists)
  launchUrl: `${appUrl}/`, // The root URL where your initial frame is served
  // Add other optional fields as needed, e.g., developer details
  // developer: {
  //   name: "Rupture Labs",
  //   url: "https://your-website.com"
  // }
};

export async function GET() {
  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      // Optional: Add caching headers if desired
      // 'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

// Optional: Handle OPTIONS requests for CORS if needed, though typically not required for .well-known
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: {
//       'Allow': 'GET, OPTIONS',
//       // Add CORS headers if your setup requires them
//     },
//   });
// }
