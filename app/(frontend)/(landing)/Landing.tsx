import { Contact } from './components/Contact/Contact';
import { ExploreStatistics } from './components/ExploreStatistics/ExploreStatistics';
import { FAQs } from './components/FAQs/FAQs';
import { Intro } from './components/Intro/Intro';
import { NextSteps } from './components/NextSteps/NextSteps';
import { OpenSource } from './components/OpenSource/OpenSource';
import { PressMentions } from './components/PressMentions/PressMentions';
import { SearchParticipant } from './components/SearchParticipant/SearchParticipant';

export function Landing() {
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
