import "./globals.css";
import Header from "./components/header";
import Sidebar from "./components/sidebar";

export const metadata = {
  title: "BAPENDA",
  description: "Sistem Informasi Geografis Badan Pendapatan Daerah",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen bg-gray-800">
        <Header />
        <div className="flex flex-row basis-full">
          <Sidebar />
          {children}
        </div>
      </body>
    </html>
  );
}
