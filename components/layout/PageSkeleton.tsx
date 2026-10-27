/** Static placeholder shown in a route's shell while its params resolve. */
export function PageSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="bg-midnight">
        <div className="container-x grid gap-12 pb-16 pt-[calc(var(--header-h)+40px)] lg:grid-cols-[1.05fr_1fr] lg:pb-20">
          <div className="space-y-5 pt-8">
            <div className="h-4 w-40 rounded bg-white/10" />
            <div className="h-14 w-4/5 rounded-lg bg-white/10" />
            <div className="h-5 w-3/5 rounded bg-white/[0.07]" />
          </div>
          <div className="aspect-[16/11] rounded-[var(--radius-panel)] bg-navy-2" />
        </div>
      </div>
      <div className="h-[60vh] bg-paper" />
    </div>
  );
}
