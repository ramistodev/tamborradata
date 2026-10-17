import { useTranslations } from 'next-intl';
import { OverviewResponse } from '../../../types/api/overview.types';
import { Hero } from './components/Hero';
import { StatsSection } from './components/stats/StatsSection';
import { SectionLayout } from './components/SectionLayout';
import { SearchParticipantsSection } from './components/search-participants/SearchParticipantsSection';
import { PressMentionsSection } from './components/press-mentions/PressMentionsSection';
import { OpenSourceSection } from './components/open-source/OpenSourceSection';
import { ContactSection } from './components/contact/ContactSection';
import { FAQSection } from './components/faq/FAQSection';

type SectionKey = 'stats' | 'searchParticipants' | 'press' | 'openSource' | 'contact' | 'faq';

interface Section {
  id: string;
  titleKey: SectionKey;
  secondaryBg?: boolean;
  render: (overview: OverviewResponse | null) => React.ReactNode;
}

const sections: Section[] = [
  {
    id: 'stats',
    titleKey: 'stats',
    render: (overview) => <StatsSection overview={overview} />,
  },
  {
    id: 'search-participants',
    titleKey: 'searchParticipants',
    secondaryBg: true,
    render: (overview) => <SearchParticipantsSection overview={overview} />,
  },
  {
    id: 'press-mention',
    titleKey: 'press',
    render: () => <PressMentionsSection />,
  },
  {
    id: 'open-source',
    titleKey: 'openSource',
    secondaryBg: true,
    render: () => <OpenSourceSection />,
  },
  {
    id: 'contact',
    titleKey: 'contact',
    render: () => <ContactSection />,
  },
  {
    id: 'faq',
    titleKey: 'faq',
    secondaryBg: true,
    render: (overview) => <FAQSection overview={overview} />,
  },
];

export function Landing({ overview }: { overview: OverviewResponse | null }) {
  const t = useTranslations('Landing.sections');

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <div className="w-full max-w-6xl flex flex-col items-center justify-center px-4 sm:px-6">
        <Hero overview={overview} />
      </div>
      {sections.map((section, index) => (
        <SectionLayout
          key={section.id}
          index={index + 1}
          title={t(section.titleKey)}
          secondaryBg={section.secondaryBg}
        >
          {section.render(overview)}
        </SectionLayout>
      ))}
    </div>
  );
}
