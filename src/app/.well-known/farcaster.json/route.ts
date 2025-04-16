import { NextResponse } from 'next/server';

const appUrl = process.env.NEXT_PUBLIC_URL || 'https://framegames.xyz'; // Use custom domain as fallback

// --- USER ACTION REQUIRED ---
// You must generate the accountAssociation data externally using Farcaster tools
// and replace the 'null' value below with the actual JSON object you receive.
// Example structure (DO NOT USE THIS EXAMPLE DIRECTLY):
// const accountAssociation = {
//   "header": "eyJmaWQiOjM2MjEsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgyY2Q4NWEwOTMyNjFmNTkyNzA4MDRBNkVBNjk3Q2VBNENlQkVjYWZFIn0",
//   "payload": "eyJkb21haW4iOiJ5b2luay5wYXJ0eSJ9",
//   "signature": "MHgwZmJiYWIwODg3YTU2MDFiNDU3MzVkOTQ5MDRjM2Y1NGUxMzVhZTQxOGEzMWQ5ODNhODAzZmZlYWNlZWMyZDYzNWY4ZTFjYWU4M2NhNTAwOTMzM2FmMTc1NDlmMDY2YTVlOWUwNTljNmZiNDUxMzg0Njk1NzBhODNiNjcyZWJjZTFi"
// };
const accountAssociation = null;
// --- END USER ACTION REQUIRED ---


// Define the Farcaster MiniApp frame details (matching sample structure)
const frameDetails = {
  // version: "1", // Optional: Add if needed
  name: "Rupture Labs Games",        // Your MiniApp's name
  iconUrl: `${appUrl}/icon.png`,      // URL to your app's icon
  homeUrl: `${appUrl}/`,              // The root URL where your initial frame is served
  imageUrl: `${appUrl}/frame.png`,    // Default image for the frame link itself
  buttonTitle: "Launch Games",        // Title for the button on the frame link
  splashImageUrl: `${appUrl}/splash.png`, // Splash image when launching
  splashBackgroundColor: "#0f172a",    // Background color for splash
  // webhookUrl: `${appUrl}/api/webhook` // Optional: Add if you have a webhook
};

// Combine the sections (only include accountAssociation if provided)
const manifest = {
  ...(accountAssociation ? { accountAssociation } : {}), // Conditionally add accountAssociation
  frame: frameDetails,
};

export async function GET() {
  if (!accountAssociation) {
    console.warn("Account association data is missing in /.well-known/farcaster.json/route.ts. MiniApp might not be discoverable.");
    // Optionally return an error or just the frame details if association is strictly required later
    // return new NextResponse('Account association data missing', { status: 500 });
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
