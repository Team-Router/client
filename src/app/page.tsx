import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <Link href="/example1">Example1</Link>
      <hr />
      <Link href="/example2">Example2</Link>
    </main>
  );
}
