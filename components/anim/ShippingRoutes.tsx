const US = "M70 52 C 360 -18, 660 40, 930 104";
const EU = "M70 156 C 360 226, 660 168, 930 104";

function Ship({ id }: { id: string }) {
  return (
    <g>
      <path d="M-14 -2 H14 L9 6 H-9 Z" fill="#D92B26" />
      <rect x="-8" y="-9" width="11" height="7" fill="#F2F3F5" />
      <rect x="4" y="-6" width="6" height="4" fill="#A3A9B3" />
      <title>{id}</title>
    </g>
  );
}

/**
 * Schematic of the two shipping lanes into Bay Harbor. Ships sail the lanes on a loop while the
 * red trail behind them fills in. With reduced motion, the ships sit still mid-crossing.
 */
export function ShippingRoutes() {
  return (
    <figure className="border border-border bg-surface">
      <svg viewBox="0 0 1000 210" className="block h-auto w-full" role="img" aria-label="Shipping lanes from US and European ports to Bay Harbor">
        <defs>
          <path id="lane-us" d={US} />
          <path id="lane-eu" d={EU} />
        </defs>
        {[40, 80, 120, 160, 200].map((y, row) =>
          [0, 1, 2, 3, 4, 5].map((col) => (
            <path
              key={`${y}-${col}`}
              className="sea-wave"
              style={{ animationDelay: `${(row + col) * -0.7}s` }}
              d={`M${120 + col * 140 + (row % 2) * 60} ${y} q 8 -6 16 0 t 16 0`}
              fill="none"
              stroke="#2A2F37"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )),
        )}
        {[US, EU].map((d) => (
          <path key={d} d={d} fill="none" stroke="#3A404A" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
        ))}
        <path d={US} pathLength={1} className="lane-trail" fill="none" stroke="#D92B26" strokeWidth="3" />
        <path d={EU} pathLength={1} className="lane-trail lane-trail--slow" fill="none" stroke="#D92B26" strokeWidth="3" />

        <g className="ship-live">
          <g>
            <Ship id="Ship from a US port" />
            <animateMotion dur="14s" repeatCount="indefinite" rotate="auto">
              <mpath href="#lane-us" />
            </animateMotion>
          </g>
          <g>
            <Ship id="Ship from a European port" />
            <animateMotion dur="20s" repeatCount="indefinite" rotate="auto">
              <mpath href="#lane-eu" />
            </animateMotion>
          </g>
        </g>
        <g className="ship-still">
          <g transform="translate(500 44) rotate(8)">
            <Ship id="Ship from a US port" />
          </g>
          <g transform="translate(500 176) rotate(-8)">
            <Ship id="Ship from a European port" />
          </g>
        </g>

        {[
          { x: 70, y: 52, label: "Savannah, Newark, Baltimore, Houston", short: "US ports", dy: 30, dyShort: -14 },
          { x: 70, y: 156, label: "Bremerhaven, Antwerp", short: "EU ports", dy: -18, dyShort: 44 },
        ].map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="6" fill="#F2F3F5" />
            <text className="route-label" x={p.x - 8} y={p.y + p.dy} fill="#A3A9B3" fontSize="15">
              {p.label}
            </text>
            <text className="route-label-short" x={p.x - 8} y={p.y + p.dyShort} fill="#A3A9B3" fontSize="34">
              {p.short}
            </text>
          </g>
        ))}
        <circle className="port-pulse" cx="930" cy="104" r="9" fill="#D92B26" />
        <circle cx="930" cy="104" r="9" fill="#D92B26" />
        <text className="harbor-label" x="950" y="142" fill="#F2F3F5" fontSize="17" fontWeight="700" textAnchor="end">
          Bay Harbor
        </text>
      </svg>
      <figcaption className="flex flex-wrap justify-between gap-2 border-t border-border px-4 py-2 text-sm text-muted">
        <span>US ports: 3 to 4 weeks at sea</span>
        <span>North Sea ports: 2 to 3 weeks at sea</span>
      </figcaption>
    </figure>
  );
}
