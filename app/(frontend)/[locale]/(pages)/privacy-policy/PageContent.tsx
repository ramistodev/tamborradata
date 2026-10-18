import { useTranslations } from 'next-intl';
import { Hero } from './components/Hero';
import { SectionAside } from './components/SectionAside';
import { SectionLayout } from './components/SectionLayout';
import { ControllerSection } from './components/sections/ControllerSection';
import { DataWeProcessSection } from './components/sections/DataWeProcessSection';
import { DataSourcesSection } from './components/sections/DataSourcesSection';
import { DataProcessingSection } from './components/sections/DataProcessingSection';
import { StatisticsSection } from './components/sections/StatisticsSection';
import { SearchSection } from './components/sections/SearchSection';
import { MinorsSection } from './components/sections/MinorsSection';
import { CookiesSection } from './components/sections/CookiesSection';
import { ThirdPartiesSection } from './components/sections/ThirdPartiesSection';
import { RightsSection } from './components/sections/RightsSection';
import { RetentionSection } from './components/sections/RetentionSection';
import { ChangesSection } from './components/sections/ChangesSection';

const sections = [
  { id: 'controller', Content: ControllerSection },
  { id: 'data', Content: DataWeProcessSection },
  { id: 'sources', Content: DataSourcesSection },
  { id: 'processing', Content: DataProcessingSection },
  { id: 'statistics', Content: StatisticsSection },
  { id: 'search', Content: SearchSection },
  { id: 'minors', Content: MinorsSection },
  { id: 'cookies', Content: CookiesSection },
  { id: 'thirdParties', Content: ThirdPartiesSection },
  { id: 'rights', Content: RightsSection },
  { id: 'retention', Content: RetentionSection },
  { id: 'changes', Content: ChangesSection },
] as const;

export function PageContent() {
  const t = useTranslations('PrivacyPolicy.sections');
  const items = sections.map(({ id, Content }) => ({ id, Content, title: t(`${id}.title`) }));

  return (
    <div
      data-smooth-scroll
      className="w-full lg:max-w-3/4 flex flex-col gap-10 lg:gap-20 px-3 sm:px-6"
    >
      <Hero />
      <hr className="h-px border-0 bg-border" />
      <div className="w-full flex pb-10 mb-10 lg:mb-30">
        <div className="lg:w-full lg:max-w-1/4 flex flex-col">
          <SectionAside sections={items.map(({ id, title }) => ({ id, title }))} />
        </div>
        <div className="w-full flex-1 flex flex-col gap-7 pb-20">
          {items.map((section, index) => (
            <SectionLayout key={section.id} id={section.id} index={index + 1} title={section.title}>
              <section.Content />
            </SectionLayout>
          ))}
        </div>
      </div>
    </div>
  );
}
