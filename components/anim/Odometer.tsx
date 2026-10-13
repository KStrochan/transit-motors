"use client";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * Shows a value like "$1,250" with each digit on a rolling drum, so a new price
 * spins into place. Screen readers get the plain text.
 */
export function Odometer({ value, className = "" }: { value: string; className?: string }) {
  const chars = value.split("");

  return (
    <span className={`relative inline-flex ${className}`}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="inline-flex leading-none">
        {chars.map((char, i) => {
          // Keyed from the right, so the ones column stays the ones column when the number grows.
          const key = chars.length - i;
          const digit = DIGITS.indexOf(char);
          if (digit === -1) {
            return (
              <span key={`s${key}`} className="inline-block whitespace-pre">
                {char === " " ? "\u00A0" : char}
              </span>
            );
          }
          return (
            <span key={`d${key}`} className="relative inline-block h-[1em] overflow-hidden tabular-nums">
              <span className="invisible">0</span>
              <span
                className="absolute inset-x-0 top-0 flex flex-col text-center transition-transform duration-700 ease-[cubic-bezier(0.22,1.4,0.36,1)] motion-reduce:transition-none"
                style={{ transform: `translateY(-${digit * 10}%)` }}
              >
                {DIGITS.map((d) => (
                  <span key={d} className="h-[1em]">
                    {d}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
