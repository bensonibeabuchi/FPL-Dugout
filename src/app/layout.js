// "use client";
// import { Provider } from "react-redux";
// import { store } from "./redux/store";
import { Poppins } from "next/font/google";
import "./globals.css";
import ClientProvider from "./components/common/ClientProvider";



const poppins = Poppins({
  subsets: ['latin'],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export const metadata = {
  title: "FPL Dugout",
  description: "The Ultimate Fantasy Experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {/* <Provider store={store}>
          {children}
        </Provider> */}
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
