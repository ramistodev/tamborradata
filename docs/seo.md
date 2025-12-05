# SEO Técnico - Optimización para Buscadores

Esta documentación explica en detalle la estrategia SEO implementada en Tamborradata para maximizar la visibilidad en buscadores (Google, Bing) y en AI Overviews (ChatGPT, Gemini, Perplexity).

---

## 📋 Índice

- [Estrategia General](#estrategia-general)
- [Metadata Optimization](#metadata-optimization)
- [Structured Data (Schema.org)](#structured-data-schemaorg)
- [Sitemap y Robots.txt](#sitemap-y-robotstxt)
- [Canonical URLs](#canonical-urls)
- [Open Graph y Twitter Cards](#open-graph-y-twitter-cards)
- [Optimización para AI Overviews](#optimización-para-ai-overviews)
- [Core Web Vitals](#core-web-vitals)

---

## Estrategia General

Tamborradata implementa una **estrategia SEO técnica avanzada** con los siguientes pilares:

### **Objetivos SEO**

1. **Indexación completa** → Todas las páginas indexadas por Google
2. **Ranking en búsquedas locales** → "Tamborrada Infantil datos", "estadísticas Tamborrada"
3. **Featured Snippets** → Aparecer en respuestas destacadas
4. **AI Overviews** → Ser fuente de información para ChatGPT/Gemini
5. **Performance óptimo** → Core Web Vitals en verde

### **Stack SEO**

- **Next.js 16 Metadata API** → Gestión de meta tags
- **Schema.org JSON-LD** → Structured data
- **Server Components** → SSR para contenido indexable
- **Sitemap dinámico** → Actualización automática
- **robots.txt optimizado** → Control de crawling

---

## Metadata Optimization

Cada página de Tamborradata incluye metadata completa y optimizada.

### **Metadata de Homepage**

```typescript
// app/page.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://tamborradata.com'),
  title: 'Tamborradata | Datos y estadísticas de la Tamborrada Infantil',
  description:
    'Explorar datos y estadísticas de la Tamborrada Infantil en Donostia-San Sebastián: participación, nombres, colegios y tendencias desde 2018.',

  alternates: {
    canonical: 'https://tamborradata.com',
  },

  keywords: [
    'Tamborradata',
    'Tamborrada Infantil',
    'estadísticas Tamborrada',
    'datos Tamborrada',
    'Donostia',
    'San Sebastián',
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  category: 'website',
};
```

### **Metadata de Páginas Dinámicas**

```typescript
// app/statistics/[year]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = params;

  return {
    title: `Estadísticas ${year} | Tamborradata`,
    description: `Datos y estadísticas completas de la Tamborrada Infantil ${year}: participación, colegios, nombres más populares y tendencias.`,
    alternates: {
      canonical: `https://tamborradata.com/statistics/${year}`,
    },
    openGraph: {
      title: `Estadísticas Tamborrada Infantil ${year}`,
      description: `Explorar datos de ${year}`,
      url: `https://tamborradata.com/statistics/${year}`,
      images: [
        {
          url: `https://tamborradata.com/og-image-${year}.webp`,
        },
      ],
    },
  };
}
```

### **Optimización de Titles**

| Página   | Title                                     | Razón               |
| -------- | ----------------------------------------- | ------------------- |
| Home     | `Tamborradata \| Datos y estadísticas...` | Branding + keywords |
| Año      | `Estadísticas 2024 \| Tamborradata`       | Año + branding      |
| Global   | `Estadísticas Globales \| Tamborradata`   | Diferenciación      |
| Búsqueda | `Buscar Participantes \| Tamborradata`    | Funcionalidad clara |

**Reglas:**

- ≤ 60 caracteres
- Branding al final (excepto home)
- Keywords al inicio
- Separador visual `|`

---

## Structured Data (Schema.org)

Tamborradata implementa **JSON-LD** para proporcionar datos estructurados a los buscadores.

### **Organization Schema**

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://tamborradata.com#organization",
  "name": "Tamborradata",
  "description": "Proyecto de datos y estadísticas sobre la Tamborrada Infantil",
  "url": "https://tamborradata.com",
  "logo": "https://tamborradata.com/favicon.ico",
  "sameAs": ["https://x.com/tamborradata", "https://github.com/ramistodev/tamborradata"]
}
```

### **WebSite Schema**

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://tamborradata.com#website",
  "name": "Tamborradata",
  "url": "https://tamborradata.com",
  "inLanguage": "es-ES",
  "publisher": { "@id": "https://tamborradata.com#organization" },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://tamborradata.com/search?name={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

**Ventaja:** Google puede mostrar un cuadro de búsqueda en los resultados.

### **Dataset Schema**

```json
{
  "@context": "https://schema.org",
  "@type": "Dataset",
  "@id": "https://tamborradata.com#dataset",
  "name": "Tamborradata - Estadísticas Históricas de la Tamborrada Infantil",
  "description": "Dataset completo con estadísticas desde 2018: participación, colegios, nombres, tendencias.",
  "url": "https://tamborradata.com",
  "creator": { "@id": "https://tamborradata.com#organization" },
  "publisher": { "@id": "https://tamborradata.com#organization" },
  "datePublished": "2018-01-20T00:00:00.000Z",
  "dateModified": "2025-01-20T00:00:00.000Z",
  "temporalCoverage": "2018-01-20/2025-01-20",
  "spatialCoverage": {
    "@type": "Place",
    "name": "San Sebastián, Gipuzkoa, País Vasco, España",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 43.3183,
      "longitude": -1.9812
    }
  },
  "keywords": [
    "Tamborrada Infantil",
    "estadísticas",
    "datos históricos",
    "Donostia",
    "San Sebastián"
  ]
}
```

**Ventaja:** Google Dataset Search puede indexar Tamborradata como fuente de datos oficial.

### **BreadcrumbList Schema**

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://tamborradata.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Estadísticas",
      "item": "https://tamborradata.com/statistics"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "2024",
      "item": "https://tamborradata.com/statistics/2024"
    }
  ]
}
```

**Ventaja:** Google muestra breadcrumbs en resultados de búsqueda.

---

## Sitemap y Robots.txt

### **Sitemap Dinámico**

```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tamborradata.com';
  const currentYear = new Date().getFullYear();

  const yearUrls = [];
  for (let i = 0; i <= currentYear - 2018; i++) {
    const year = 2018 + i;
    if (year === 2021) continue; // Sin datos

    yearUrls.push({
      url: `${baseUrl}/statistics/${year}`,
      lastModified: year === currentYear ? new Date() : new Date(`${year}-01-20`),
      changeFrequency: 'yearly',
      priority: year === currentYear ? 0.9 : 0.7,
    });
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/statistics/global`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...yearUrls,
  ];
}
```

**Características:**

- ✅ Generación automática de URLs
- ✅ Excluye años sin datos (2021)
- ✅ Prioridades diferenciadas
- ✅ `lastModified` dinámico

### **robots.txt Optimizado**

```txt
User-agent: *
Allow: /

# Block API endpoints
Disallow: /api/
Disallow: /_next/
Disallow: /_vercel/

# Block sensitive files
Disallow: /*.json$
Disallow: /*.xml$

# SEO directives
Sitemap: https://tamborradata.com/sitemap.xml

# AI Crawlers (allow)
User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /
```

**Estrategia:**

- ✅ Permite todos los bots
- ✅ Bloquea solo rutas internas
- ✅ Explicita permiso para AI crawlers
- ✅ Sitemap visible

---

## Canonical URLs

Todas las páginas incluyen **canonical URLs** para evitar contenido duplicado.

### **Implementación**

```typescript
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://tamborradata.com/statistics/2024',
  },
};
```

### **Reglas**

| Condición              | Canonical          |
| ---------------------- | ------------------ |
| URL con trailing slash | Sin trailing slash |
| URL con query params   | Sin query params   |
| Múltiples dominios     | Solo `.com`        |
| HTTP/HTTPS             | Siempre HTTPS      |

**Ejemplo:**

```
https://tamborradata.com/statistics/2024/
→ https://tamborradata.com/statistics/2024
```

---

## Open Graph y Twitter Cards

### **Open Graph**

```typescript
openGraph: {
  title: 'Tamborradata | Datos de la Tamborrada Infantil',
  description: 'Explorar estadísticas desde 2018',
  url: 'https://tamborradata.com',
  siteName: 'Tamborradata',
  images: [{
    url: 'https://tamborradata.com/og-image.webp',
    width: 1200,
    height: 630,
    alt: 'Tamborradata - Estadísticas Tamborrada Infantil',
  }],
  locale: 'es_ES',
  type: 'website',
}
```

### **Twitter Cards**

```typescript
twitter: {
  card: 'summary_large_image',
  title: 'Tamborradata | Datos de la Tamborrada Infantil',
  description: 'Explorar estadísticas desde 2018',
  images: [{
    url: 'https://tamborradata.com/og-image.webp',
    alt: 'Tamborradata - Estadísticas',
  }],
  site: '@tamborradata',
  creator: '@tamborradata',
}
```

### **Dimensiones de Imágenes OG**

| Plataforma | Tamaño Recomendado | Formato   |
| ---------- | ------------------ | --------- |
| Facebook   | 1200×630px         | WebP/JPEG |
| Twitter    | 1200×628px         | WebP/JPEG |
| LinkedIn   | 1200×627px         | WebP/JPEG |

**Imagen actual:** `og-image.webp` → 1200×630px, 45KB, WebP

---

## Optimización para AI Overviews

Tamborradata está optimizada para ser fuente de información en **AI Overviews** (ChatGPT, Gemini, Perplexity).

### **Estrategias Implementadas**

#### **1. Permitir AI Crawlers**

```txt
User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /
```

#### **2. Estructura Semántica**

```html
<h1>Estadísticas de la Tamborrada Infantil 2024</h1>

<section aria-label="Participación Total">
  <h2>Participación Total</h2>
  <p>En 2024, participaron <strong>3,245 niños y niñas</strong>...</p>
</section>
```

**Razón:** Los AI parsean mejor contenido con headings jerárquicos.

#### **3. Dataset Schema**

El schema `Dataset` permite que AI identifiquen Tamborradata como **fuente de datos oficial**.

#### **4. Contenido Estructurado**

```markdown
# Estadísticas 2024

## Participación

- Total: 3,245 participantes
- Incremento: +5.2% vs 2023

## Colegios

Top 3:

1. Colegio A - 450 participantes
2. Colegio B - 380 participantes
3. Colegio C - 320 participantes
```

**Razón:** Listas, tablas y números son fácilmente parseables por AI.

---

## Core Web Vitals

Tamborradata optimiza las métricas de rendimiento de Google.

### **Métricas Objetivo**

| Métrica                            | Objetivo | Actual |
| ---------------------------------- | -------- | ------ |
| **LCP** (Largest Contentful Paint) | < 2.5s   | ~1.8s  |
| **FID** (First Input Delay)        | < 100ms  | ~50ms  |
| **CLS** (Cumulative Layout Shift)  | < 0.1    | ~0.05  |
| **FCP** (First Contentful Paint)   | < 1.8s   | ~1.2s  |
| **TTI** (Time to Interactive)      | < 3.8s   | ~2.5s  |

### **Optimizaciones Aplicadas**

#### **1. Server Components (SSR)**

```typescript
// Server Component → contenido renderizado en servidor
export default async function StatisticsPage({ params }) {
  const data = await fetchStatistics(params.year);
  return <StatisticsContent data={data} />;
}
```

**Ventaja:** FCP y LCP mejoran drásticamente.

#### **2. Imágenes Optimizadas**

```typescript
import Image from 'next/image';

<Image
  src="/logo.webp"
  alt="Tamborradata"
  width={200}
  height={50}
  loading="lazy"
  placeholder="blur"
/>
```

**Optimizaciones:**

- Formato WebP
- Lazy loading
- Placeholder blur
- Tamaños responsivos

#### **3. Fonts Optimizadas**

```typescript
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});
```

**Ventaja:** `font-display: swap` evita FOIT (Flash of Invisible Text).

#### **4. Prefetching**

```typescript
<Link href="/statistics/2024" prefetch={true}>
  Ver estadísticas 2024
</Link>
```

**Ventaja:** Siguiente página carga instantáneamente.

---

## Herramientas de Validación

### **Google Search Console**

- ✅ Todas las páginas indexadas
- ✅ Sin errores de crawling
- ✅ Core Web Vitals en verde
- ✅ Mobile-first index activo

### **Lighthouse**

- ✅ Performance: 95+
- ✅ Accessibility: 100
- ✅ Best Practices: 100
- ✅ SEO: 100

### **Rich Results Test**

- ✅ Organization schema válido
- ✅ Dataset schema válido
- ✅ BreadcrumbList schema válido

---

## Referencias

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Next.js SEO](https://nextjs.org/learn/seo/introduction-to-seo)
- [Core Web Vitals](https://web.dev/vitals/)
