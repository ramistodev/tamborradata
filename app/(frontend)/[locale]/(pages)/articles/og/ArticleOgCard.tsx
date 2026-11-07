import { ogColors, ogFontFamily, ogSafeMargin, ogSize } from '../../../config/og/constants';
import { articleOgLayout, getArticleOgTitleSize } from './ogConfig';

export interface ArticleOgCardProps {
  title: string;
  description: string;
  category: string;
  readTime: string;
  host: string;
  brand: string;
  logoSrc?: string;
}

export function ArticleOgCard({
  title,
  description,
  category,
  readTime,
  host,
  brand,
  logoSrc,
}: ArticleOgCardProps) {
  const layout = articleOgLayout;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: ogSize.width,
        height: ogSize.height,
        backgroundColor: ogColors.background,
        backgroundImage: `linear-gradient(135deg, ${ogColors.backgroundSecondary} 0%, ${ogColors.background} 55%)`,
        fontFamily: ogFontFamily.body,
        color: ogColors.text,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: ogSize.width,
          height: ogSize.height,
          backgroundImage: `radial-gradient(circle at 100% 0%, rgba(77,140,255,0.28) 0%, rgba(77,140,255,0.08) 38%, rgba(77,140,255,0) 68%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: layout.frameInset,
          left: layout.frameInset,
          right: layout.frameInset,
          bottom: layout.frameInset,
          border: `1px solid ${ogColors.border}`,
          borderRadius: layout.frameRadius,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: layout.accentBarWidth,
          height: ogSize.height,
          backgroundImage: `linear-gradient(180deg, ${ogColors.accent} 0%, ${ogColors.accentDim} 55%, rgba(44,108,217,0) 100%)`,
        }}
      />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: `${ogSafeMargin - 12}px ${ogSafeMargin}px ${ogSafeMargin - 20}px`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc}
              width={layout.logoSize}
              height={layout.logoSize}
              style={{ marginRight: 14 }}
              alt=""
            />
          ) : null}
          <div
            style={{
              fontFamily: ogFontFamily.title,
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: -0.5,
              color: ogColors.text,
            }}
          >
            {brand}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', marginBottom: 28 }}>
            <div
              style={{
                display: 'flex',
                padding: '8px 18px',
                borderRadius: 999,
                border: '1px solid rgba(77,140,255,0.45)',
                backgroundColor: ogColors.accentGlow,
                fontFamily: ogFontFamily.mono,
                fontWeight: 500,
                fontSize: 18,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: ogColors.accent,
              }}
            >
              {category}
            </div>
          </div>
          <div
            style={{
              display: 'block',
              fontFamily: ogFontFamily.title,
              fontWeight: 700,
              fontSize: getArticleOgTitleSize(title),
              lineHeight: layout.titleLineHeight,
              letterSpacing: layout.titleLetterSpacing,
              color: ogColors.text,
              lineClamp: layout.titleMaxLines,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'block',
              marginTop: 26,
              fontFamily: ogFontFamily.body,
              fontWeight: 400,
              fontSize: layout.descriptionFontSize,
              lineHeight: layout.descriptionLineHeight,
              color: ogColors.textSecondary,
              lineClamp: layout.descriptionMaxLines,
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `1px solid ${ogColors.border}`,
            paddingTop: 20,
            fontFamily: ogFontFamily.mono,
            fontWeight: 500,
            fontSize: 20,
            letterSpacing: 1,
            color: ogColors.textTertiary,
          }}
        >
          <div style={{ display: 'flex' }}>{host}</div>
          <div style={{ display: 'flex' }}>{readTime}</div>
        </div>
      </div>
    </div>
  );
}
