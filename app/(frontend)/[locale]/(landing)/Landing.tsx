import { OverviewResponse } from '../../../types/api/overview.types';
import { Hero } from './components/Hero';
import { StatsSection } from './components/stats/StatsSection';
import { SectionLayout } from './components/SectionLayout';
import { SearchParticipantsSection } from './components/search-participants/SearchParticipantsSection';
import { PressMentionsSection } from './components/press-mentions/PressMentionsSection';
import { OpenSourceSection } from './components/open-source/OpenSourceSection';
import { ContactSection } from './components/contact/ContactSection';
import { FAQSection } from './components/faq/FAQSection';

const sections = [
  {
    id: 'stats',
    title: 'Statistics',
    render: (overview: OverviewResponse | null) => <StatsSection overview={overview} />,
  },
  {
    id: 'search-participants',
    title: 'Search Participants',
    secondaryBg: true,
    render: (overview: OverviewResponse | null) => (
      <SearchParticipantsSection overview={overview} />
    ),
  },
  {
    id: 'press-mention',
    title: 'Press Mention',
    render: () => <PressMentionsSection />,
  },
  {
    id: 'open-source',
    title: 'Open Source',
    secondaryBg: true,
    render: () => <OpenSourceSection />,
  },
  {
    id: 'contact',
    title: 'Contact',
    render: () => <ContactSection />,
  },
  {
    id: 'faq',
    title: 'FAQ',
    render: (overview: OverviewResponse | null) => <FAQSection overview={overview} />,
  },
];

export function Landing({ overview }: { overview: OverviewResponse | null }) {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <div className="w-full max-w-6xl flex flex-col items-center justify-center px-4 sm:px-6">
        <Hero overview={overview} />
      </div>
      {sections.map((section, index) => (
        <SectionLayout
          key={index}
          index={index + 1}
          title={section.title}
          secondaryBg={section.secondaryBg}
        >
          {section.render(overview)}
        </SectionLayout>
      ))}
    </div>
  );
}
