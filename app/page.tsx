import Link from "next/link";


export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <div className="max-w-md text-center w-full space-y-8 p-10 bg-white rounded-2xl shadow-sm border border-zinc-200">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            UI Construction
          </h1>
          <p className="text-zinc-500">
            Securely manage payroll, track earnings, and generate reports.
          </p>
        </div>

        <div className="pt-4">
          <Link href="/login" className="inline-flex items-center justify-center">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
