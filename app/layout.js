import "./globals.css";

export const metadata = {
  title: "Eat Clean - Thuc don an song khoe",
  description: "Ung dung quan ly thuc don an sach, theo doi luong calo hang ngay",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    viewportFit: "cover",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
