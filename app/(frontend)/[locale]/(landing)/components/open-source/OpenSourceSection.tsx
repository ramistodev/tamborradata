import { Icons } from '../../../components/Icons';
import { REPO_NAME, REPO_URL, TECH_STACK, TERMINAL_LINES } from './openSource';
import { TerminalLine } from './TerminalLine';
import { TerminalWindow } from './TerminalWindow';

export function OpenSourceSection() {
  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col items-start gap-6">
        <h2 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          La web se construye a la vista de todos
        </h2>
        <p className="text-lg text-text-secondary text-balance">
          El código de la interfaz, sus componentes y sus visualizaciones es público: puedes leerlo,
          ejecutarlo en local y proponer mejoras. El pipeline interno de obtención y procesamiento
          de datos no forma parte del repositorio.
        </p>

        <ul aria-label="Tecnologías" className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-sm">
          {TECH_STACK.map((tech) => (
            <li
              key={tech}
              className="text-text-tertiary not-last:after:ml-4 not-last:after:content-['/']"
            >
              {tech}
            </li>
          ))}
        </ul>

        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-bg transition-opacity duration-200 hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
        >
          <Icons.GithubIcon className="size-5" />
          Ver en GitHub
          <Icons.ArrowRight className="size-4" />
          <span className="sr-only">(se abre en una pestaña nueva)</span>
        </a>
      </div>

      <TerminalWindow title={REPO_NAME}>
        {TERMINAL_LINES.map((line) => (
          <TerminalLine key={line.text} {...line} />
        ))}
      </TerminalWindow>
    </div>
  );
}
