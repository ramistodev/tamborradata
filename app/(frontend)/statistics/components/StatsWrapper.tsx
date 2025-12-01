export function StatsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-start w-full py-3 mt-22">
      <section className="w-full max-w-6xl flex flex-col items-start justify-start gap-6 p-4 sm:px-15 md:px-30 rounded-2xl border border-(--color-border)">
        {children}
      </section>
    </div>
  );
}
