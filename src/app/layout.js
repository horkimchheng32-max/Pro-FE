import { Barlow, Barlow_Condensed } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const body = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--f-body" });
const display = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "800"], style: ["normal", "italic"], variable: "--f-display" });

export const metadata = { title: "Sporty", description: "Sports, events and the people who show up." };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <footer className="foot"><div className="wrap">© Sporty · Powered by the Sport API</div></footer>
      </body>
    </html>
  );
}
