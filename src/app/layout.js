// "use client";
// import { Provider } from "react-redux";
// import { store } from "./redux/store";
import { Poppins } from "next/font/google";
import "./globals.css";
import ClientProvider from "./components/common/ClientProvider";
import Head from "next/head";



const poppins = Poppins({
  subsets: ['latin'],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export const metadata = {
  title: "FPL Dugout",
  description: "The Ultimate Fantasy Experience",
  googleAdsenseAccount: "ca-pub-5444473500763929",
  applicationName: 'FPLDugout',
  keywords: ['FPL', 'Fantasy Football', 'Football', 'League', 'EPL', 'Premier League', 'Liverpool', 'Arsenal', 'Manchester United', 'Manchester City', 'Chelsea', 'Dugout', 'Fantasy Football League'],
  authors: [{ name: 'Benson Ibeabuchi' }, { name: 'Benson Ibeabuchi', url: 'https://bensonibeabuchiportfolio.vercel.app/' }],
  creator: 'Benson Ibeabuchi',
  publisher: 'Benson Ibeabuchi',
  siteName: 'FPL Dugout',
  type: 'website',
  
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Add Google AdSense script */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5444473500763929"
     crossorigin="anonymous"></script>
        <meta name="google-adsense-account" content="ca-pub-5444473500763929" />
      </head>
      
      <body className={poppins.className}>
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
