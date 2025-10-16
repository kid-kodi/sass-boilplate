import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans items-center justify-center h-screen">
      <main className="flex flex-col gap-10 items-center justify-center h-screen">
        <Image
          className="dark:invert"
          src="/images/logo.png"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/login"
          >
            Conectez-vous
          </Link>
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="/signup"
            
          >
            Enregistrez-vous
          </Link>
        </div>
      </main>
    </div>
  );
}
