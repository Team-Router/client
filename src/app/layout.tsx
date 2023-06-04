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
      <body>
        <main id="root-layout">{children}</main>
      </body>
    </html>
  );
}
