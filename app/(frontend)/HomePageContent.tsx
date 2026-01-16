import { ExploreStatistics } from './components/ExploreStatistics/ExploreStatistics';
import { SearchParticipant } from './components/SearchParticipant/SearchParticipant';
import { PressMentions } from './components/PressMentions/PressMentions';
import { OpenSource } from './components/OpenSource/OpenSource';
import { NextSteps } from './components/NextSteps/NextSteps';
import { Contact } from './components/Contact/Contact';
import { Intro } from './components/Intro/Intro';
import { FAQs } from './components/FAQs/FAQs';

export function HomePageContent() {
  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center gap-4">
      <Intro />
      <PressMentions />
      <SearchParticipant />
      <ExploreStatistics />
      <NextSteps />
      <OpenSource />
      <Contact />
      <FAQs />
    </div>
  );
}
