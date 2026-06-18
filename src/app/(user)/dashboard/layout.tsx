export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-linear-to-br from-gray-100 via-zinc-50 to-amber-50 text-zinc-900 overflow-x-hidden">
      {children}
    </div>
  );
}
