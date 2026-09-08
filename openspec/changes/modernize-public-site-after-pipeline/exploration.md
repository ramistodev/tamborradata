# Exploration: Modernize the public Tamborradata site after the pipeline contract

## Current State

Tamborradata is a Next.js 16 App Router application with public routes for home (`/`), participant search (`/search`), statistics redirect (`/statistics` → `/statistics/global`), global statistics (`/statistics/global`), yearly statistics (`/statistics/[year]`), and methodology (`/statistics/info`). The home combines introduction, press, search, statistics, open-source, contact, and FAQ sections; the search workflow requires a full name plus a school/company and returns year, school, and name matches.

The production build confirms that `/`, `/search`, `/statistics`, `/statistics/global`, `/statistics/info`, and `/sitemap.xml` are static; `/statistics/[year]` and all six API routes are dynamic. This is not server-data rendering: the statistics layouts and content are client components using React Query to fetch internal GET APIs after hydration. The home also has many animated client sections. The current server components mainly supply shell, metadata, and JSON-LD.

The web API is read-only: `GET /api/statistics`, `/api/category`, `/api/participants`, `/api/years`, `/api/companies`, and `/api/ping`. Server-only repositories use the Supabase anonymous key to query `statistics` (`category`, `public_data`, `full_data`, `summary`), `participants` (`name`, `school`, `year`), `available_years`, `available_companies_view`, and `sys_status`. The public statistics contract is a grouping of category-keyed JSON blobs; lazy category expansion depends on `full_data`. `sys_status.is_updating` causes a temporary client polling flow.

There is no authentication, cookie/session access, server action, or non-GET route handler. Therefore no existing browser-authenticated mutation exists for CSRF to protect. The middleware only rejects HTML-accepting requests to `/api/*` in production; it is not CSRF protection.

Metadata, canonical URLs, Open Graph/Twitter data, and JSON-LD (`Organization`, `WebSite`, `Dataset`, `WebPage`, `Article`, `FAQPage`, breadcrumbs, and a single press mention) are implemented. `public/robots.txt` advertises the sitemap and disallows APIs. `app/sitemap.ts` is build-static but guesses valid years from 2018 through the current calendar year and manually excludes 2021; it does not use published data availability or publication timestamps. Documentation claims SSR/prefetching, Dataset JSON-LD details, AI crawler policies, and performance results that are not all present in the current code.

## Affected Areas

- `app/(frontend)/page.tsx`, `HomePageContent.tsx`, `components/*` — home information architecture, visual language, press credibility, and client-animation boundary.
- `app/(frontend)/search/*`, `app/(frontend)/components/SearchParticipant/*` — preserve the personal-use search journey while replacing CSR-only result fetching and reviewing sensitive-result exposure.
- `app/(frontend)/statistics/{global,[year]}/*` — migrate category-blob UI to a typed published-read model with server-rendered narrative and client-only visualization controls.
- `app/(frontend)/hooks/query/*`, `services/*`, `providers/ReactQueryProvider.tsx` — React Query currently owns all public data reads, with infinite caches for statistics and participant search.
- `app/(backend)/api/*`, `core/db/supabaseClient.ts` — current Route → Service → Repository adapter and anonymous Supabase reads; replace or narrow once the pipeline's published contract is known.
- `app/(backend)/api/{statistics,category}/repositories/*` — tightly coupled to legacy `statistics.category`, `public_data`, `full_data`, and `summary` JSON blobs.
- `app/(backend)/api/participants/repositories/participants.repo.ts` — tightly coupled to raw participant names, schools, and years; it is the privacy-sensitive boundary.
- `app/(backend)/shared/utils/getSysStatus.ts` — legacy global update flag and January/early-February polling behavior.
- `app/sitemap.ts`, `public/robots.txt` — derive sitemap routes and `lastModified` values from published data rather than a calendar loop.
- `app/(frontend)/layout.tsx`, `*StructuredData.tsx`, route metadata — consolidate accurate, data-backed metadata and JSON-LD, including provenance/version and publication dates.
- `next.config.ts`, `middleware.ts`, deployment configuration — security headers, canonical-domain redirect, deployment-time build/revalidation strategy, and modern Next proxy migration.
- `mocked_data/tamborradata_schema.sql`, frontend statistics types — legacy schema/types are useful compatibility evidence only; they must not define the new pipeline contract.

## Approaches

1. **Contract-first staged modernization** — Finish the private pipeline's published database/read-model contract, then build a server-oriented public read layer and incrementally replace route slices.
   - Pros: separates sensitive ingestion from public publication; enables typed server reads, traceability, accurate sitemap/SEO, atomic published versions, and a coherent UX redesign; avoids freezing a bad database shape for web compatibility.
   - Cons: requires a formal cross-repository contract and a transition adapter for existing pages.
   - Effort: High.

2. **Frontend-first redesign over the legacy statistics table** — Refresh UI and move current API calls into server components while retaining `statistics` JSON blobs and the current update flag.
   - Pros: faster visual change; lower initial coordination cost.
   - Cons: preserves opaque category strings, `public_data`/`full_data` coupling, inaccurate publication metadata, and a weak traceability model; likely creates a second migration after the pipeline changes.
   - Effort: Medium, with high rework risk.

3. **Publish an API/BFF contract only** — Keep the web database-agnostic by having the pipeline expose versioned public endpoints, with the Next app consuming them server-side.
   - Pros: strongest isolation between repositories and a clean public surface.
   - Cons: adds an operational service and cache/auth boundary that the current read-only Supabase deployment does not need; still requires the same publication and provenance semantics.
   - Effort: High.

## Recommendation

Choose **contract-first staged modernization**. The pipeline should first publish a versioned, read-only public model that contains only approved public fields and exposes: available published editions, global and edition narratives/metrics, chart/table datasets, source/provenance references, data-quality notes, publication/version timestamps, and a single publication status. The website should read that model server-side for indexable route content; use client components only for charts, progressive tables, search form state, and motion that materially improves comprehension.

Plan now: information architecture and content design for residents/families, journalists, educators, institutions, and technical visitors; a server-read repository boundary; route-specific loading/error/not-found behavior; an accessible design system; source/provenance presentation; metadata/JSON-LD templates; a build-time sitemap fed from a published manifest; performance/a11y/SEO measurement; and migration slices below the 400-line review budget.

Wait for the pipeline contract: final table/view/RPC names; metric definitions and category taxonomy; participant-search policy and result shape; traceability fields and source-link permissions; publication/version/rollback semantics; freshness/revalidation signal; and RLS/service-role boundaries. Do not design UI payloads around the current JSON blobs or assume raw participants remain queryable.

CSRF is **not a current modernization prerequisite**. Add origin/CSRF validation only if the public web later introduces cookie-authenticated state-changing requests (for example, an authenticated correction/removal workflow or editorial/admin mutations). Keep pipeline writes off the public browser surface; token-authenticated server-to-server pipeline writes need credential and authorization controls, not browser CSRF tokens.

## Risks

- The current participant search returns raw name, school, and year records despite methodology and JSON-LD claiming individual data is not exposed. Its legal/privacy policy, minimization rules, rate limiting, and abuse controls must be settled with the final public contract before expanding or promoting it.
- Yearly/global UI types, lazy pagination, and summaries assume category names and JSON payload shapes from the legacy `statistics` table. A schema swap without a compatibility adapter will break pages.
- The sitemap can index years with no published data because it derives URLs from the calendar; static generation must consume only the final published manifest and stable `lastModified` values.
- Client-first statistics currently ship loading shells and fetch data after hydration, limiting indexable narrative and perceived performance. A visual redesign alone does not fix this.
- Static docs overstate the implemented SSR, prefetching, robots/AI-crawler, structured-data, and performance behavior. Modernization must include a documentation and validation pass.
- The build succeeds but reports the deprecated `middleware` convention and resolves Next.js 16.0.10 during build while `package.json` declares 16.2.6; dependency-lock reconciliation and migration to `proxy` need a separate, verified slice.

## Ready for Proposal

Yes, for a proposal that explicitly sequences **pipeline publication contract → public server-read foundation → search/privacy decision → statistics and narrative migration → sitemap/SEO and UX rollout**. The proposal must treat the pipeline contract as a gate, not an implementation detail, and must request the final public model before selecting tables, RPCs, cache tags, or page payload types.
