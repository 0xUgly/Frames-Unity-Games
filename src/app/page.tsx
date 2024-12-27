import { Metadata } from "next";
import App from "./app";

const appUrl = process.env.NEXT_PUBLIC_URL;

const frame = {
  version: "next",
  imageUrl: `${appUrl}/frame.png`,
  button: {
    title: "Launch Frame",
    action: {
      type: "launch_frame",
      name: "Rupture Labs",
      url: appUrl,
      splashImageUrl: `${appUrl}/splash1.png`,
      splashBackgroundColor: "#0f172a",
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Rupture Labs ",
    openGraph: {
      title: "Rupture Labs Frames",
      description: "Lets start Gaming ",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return (<App />);
}
