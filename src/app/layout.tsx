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
  const MetaTag = (
    <head>
      <meta
        httpEquiv="Content-Security-Policy"
        content="upgrade-insecure-requests"
      ></meta>
    </head>
  );

  return (
    <html lang="ko">
      {process.env.NODE_ENV !== 'development' && MetaTag}
      <body>
        <main id="root-layout">{children}</main>
      </body>
    </html>
  );
}
