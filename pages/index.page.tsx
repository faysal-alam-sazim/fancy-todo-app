import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <p>This is Home page</p>
      <Link href="/todo">Go to To Do App</Link>
    </main>
  );
}
