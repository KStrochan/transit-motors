# Transit Motors

Demo website for Transit Motors, a car import agency I made up for my portfolio. The business, people and prices are fictional; the code is real.

We find, inspect and ship used cars from the US and Europe, and hand them over ready to drive.

## Status

Live at https://transit-motors.vercel.app

What is built:

- Home: cars in transit with shipping progress, how it works, reviews, FAQ and an enquiry form
- Landed cost calculator (`/calculator`) with a full breakdown and delivery time; demo rates live in `lib/landed-cost.ts`
- Contact page (`/contact`) that picks up the calculated estimate

## Design

Dark and high contrast: near-black with a racing-red accent, large photography and hard diagonals.

| Token | Value |
| --- | --- |
| bg | `#0B0D10` |
| surface | `#15181D` |
| fg | `#F2F3F5` |
| muted | `#A3A9B3` |
| border | `#2A2F37` |
| accent | `#D92B26` |
| on accent | `#FFFFFF` |
| link | `#FF7A73` |
| error | `#FF8A80` |
| radius | `0px` |

Headings use Exo 2, body text uses Manrope. Both are self-hosted from `app/fonts` through `next/font/local`.

## Stack

- Next.js 16 (App Router), React 19
- TypeScript in strict mode
- Tailwind CSS 4
- zod for form validation
- Vitest and Testing Library
- Lighthouse CI

## Getting started

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run check` | Type check, lint and tests |
| `npm run lighthouse` | Builds the site, runs Lighthouse five times on mobile and fails if the median score in any category drops below 95 or the median LCP goes above 2.5 s |

## Contact form

Enquiries go to a Telegram chat. Copy `.env.example` to `.env.local` and fill in `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. Without them the form runs in demo mode and tells the visitor that nothing was sent.

## Deploying

Import the repository in Vercel and add the two Telegram variables if the form should deliver leads. If the domain changes, update `url` in `content/site.ts` and `tests/metadata.test.ts`.

## Credits

Fonts are licensed under the SIL Open Font License; the license texts are in `app/fonts`. Photos are hotlinked from Unsplash and credited in the site footer.

## License

Code: MIT
