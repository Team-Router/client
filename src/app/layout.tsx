import './globals.css';

export const metadata = {
  title: 'RE-cycle',
  description: '공유 자전거 경로 찾기 서비스',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4bb277" />
        <link rel="icon" href="/favicons/favicon.ico" />
        <link
          href="/favicons/favicon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/favicons/favicon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png"></link>
        <link rel="apple-touch-startup-image" href="/splash-screen.png"></link>
      </head>
      <body>
        <main id="root-layout">{children}</main>
      </body>
    </html>
  );
}
