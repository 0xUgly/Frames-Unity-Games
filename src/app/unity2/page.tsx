import { Metadata } from "next";
import Unity2ClientComponent from "./client"; // Import the new client component

const appUrl = process.env.NEXT_PUBLIC_URL || "https://framegames.xyz"; // Use custom domain as fallback
const gameName = "Base Ballz";
const gameImageUrl = `${appUrl}/gameimg/baseballz1.png`;
const gameRoute = "/unity2";

// Define the frame metadata for this specific game page (Server-Side)
const frame = {
  version: "next",
  imageUrl: gameImageUrl,
  button: {
    title: `Play ${gameName}`,
    action: {
      type: "launch_frame",
      name: `Play ${gameName}`,
      url: `${appUrl}${gameRoute}`,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#0f172a",
    },
  },
};

// Export generateMetadata function (Server-Side)
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: gameName,
    openGraph: {
      title: gameName,
      description: `Play ${gameName} on Farcaster!`,
      images: [gameImageUrl],
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

// The default export is now a simple Server Component rendering the Client Component
export default function Page() {
  // This component renders on the server initially,
  // then the Client Component takes over in the browser.
  return <Unity2ClientComponent />;
}