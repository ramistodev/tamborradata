import type notFound from '../es/notFound';

export default {
  kicker: 'Error',
  title: 'This page is outside of the universe',
  description:
    "The page you are trying to access doesn't exist or has been moved. Try going back to the home page.",
  backHome: 'Go to the home page',
} satisfies typeof notFound;
