/**
 * Numbered because this is a real sequence. Vertical timeline on mobile,
 * horizontal track on large screens.
 */
export function ProcessSteps({ steps }: { steps: { title: string; text: string }[] }) {
  const cols = steps.length >= 6 ? "lg:grid-cols-6" : steps.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4";
  return (
    <ol className={`relative grid gap-0 lg:gap-6 ${cols}`}>
      {steps.map((step, i) => (
        <li key={step.title} className="relative flex gap-5 pb-10 last:pb-0 lg:block lg:pb-0">
          {/* connector */}
          <span
            aria-hidden="true"
            className={`absolute left-[21px] top-12 bottom-0 w-px bg-line-strong lg:left-12 lg:right-[-1.5rem] lg:top-[21px] lg:h-px lg:w-auto ${
              i === steps.length - 1 ? "hidden" : ""
            }`}
          />
          <span className="relative z-[1] grid size-11 shrink-0 place-items-center rounded-full border border-cyan/60 bg-midnight text-sm font-bold text-cyan">
            {i + 1}
          </span>
          <div className="lg:mt-6">
            <h3 className="text-lg font-bold text-white">{step.title}</h3>
            <p className="mt-2 leading-relaxed text-mist">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
