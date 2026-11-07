type Location = 'rightCenter' | 'rightTop' | 'center';

export function Hero({ children, location }: { children?: React.ReactNode; location?: Location }) {
  const locationClasses = {
    rightCenter: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2',
    rightTop: 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
    center: 'top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2',
  } as const satisfies Record<Location, string>;

  const locationClass = location ? locationClasses[location] : '';

  return (
    <section className="bg-bg flex flex-col items-center w-full relative overflow-hidden border-b border-border">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute ${locationClass} z-10 h-128 w-full bg-[radial-gradient(closest-side,var(--accent-glow),transparent)] `}
      />
      <div className="relative z-20 lg:w-2/3 w-full flex flex-col gap-8 py-10 md:gap-10 px-4 sm:px-5 pb-8 md:pb-15">
        {children}
      </div>
    </section>
  );
}
