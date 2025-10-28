import Link from 'next/dist/client/link';

export default function Home() {
  return (
    <main className="flex items-center justify-center w-full h-full">
      <h1>Tamborrada Stats - Home</h1>
      <p>
        <Link href="/statistics/global">Ver estadísticas globales</Link>
      </p>
    </main>
  );
}
