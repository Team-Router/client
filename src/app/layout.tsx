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
        <meta
          http-equiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        ></meta>
      </head>
      <body>
        <main id="root-layout">{children}</main>
      </body>
    </html>
  );
}
