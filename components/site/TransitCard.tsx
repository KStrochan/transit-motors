import { stages, type CarInTransit } from "@/content/home";
import { formatUsd } from "@/lib/landed-cost";

export function TransitCard({ car }: { car: CarInTransit }) {
  return (
    <article className="grid content-between gap-6 border border-border bg-surface p-5">
      <div className="grid gap-2">
        <p className="text-sm text-muted">
          {car.year}, {car.mileage}, {car.engine}
        </p>
        <h3 className="font-display text-2xl font-bold leading-tight">{car.model}</h3>
        <p className="text-sm text-muted">{car.route}</p>
      </div>
      <div className="grid gap-3">
        <ol className="grid grid-cols-4 gap-1" aria-label={`Shipping progress: ${stages[car.stage]}`}>
          {stages.map((stage, index) => (
            <li key={stage} className="grid gap-1.5">
              <span
                aria-hidden="true"
                className={`h-1.5 -skew-x-[30deg] ${index <= car.stage ? "bg-accent" : "bg-border"}`}
              />
              <span className={`text-[0.7rem] ${index === car.stage ? "font-bold text-fg" : "text-muted"}`}>
                {stage}
                {index === car.stage ? <span className="sr-only"> (current stage)</span> : null}
              </span>
            </li>
          ))}
        </ol>
        <div className="flex items-end justify-between gap-4 border-t border-border pt-3">
          <p className="text-sm font-semibold">{car.eta}</p>
          <p className="text-right">
            <span className="block text-xs text-muted">Landed price</span>
            <span className="font-display text-xl font-bold tabular-nums">{formatUsd(car.landed)}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
