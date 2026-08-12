import "./globals.css";

export const metadata = {
  title: "Eat Clean - Thuc don an song khoe",
  description: "Ung dung quan ly thuc don an sach, theo doi luong calo hang ngay",
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
