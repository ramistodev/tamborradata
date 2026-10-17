import { Icons } from '../../../components/Icons';
import { NewspaperClipping } from './NewspaperClipping';
import { pressArticle } from './pressArticle';

export function PressMentionsSection() {
  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
      {/* Text first in the DOM (and on mobile); the clipping goes on the left from `lg` */}
      <div className="flex flex-col items-start gap-5 lg:order-2">
        <h2 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          «Un espejo digital de la fiesta»
        </h2>
        <p className="text-lg text-text-secondary text-balance">
          Así presentó {pressArticle.publication} Tamborradata: el «gran archivo histórico y
          estadístico» de la Tamborrada Infantil, con un buscador para las familias y un
          observatorio para entender la ciudad a través de sus nombres.
        </p>
        <a
          href={pressArticle.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          Abrir el artículo original
          <Icons.ExternalLink className="size-3.5" />
          <span className="sr-only">(se abre en una pestaña nueva)</span>
        </a>
      </div>

      <div className="px-2 lg:order-1 lg:px-0">
        <NewspaperClipping />
      </div>
    </div>
  );
}
