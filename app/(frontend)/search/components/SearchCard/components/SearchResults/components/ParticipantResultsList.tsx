import { useSearchContext } from '@/app/(frontend)/search/context/useSearchContext';

export function ParticipantResultsList() {
  const { participants } = useSearchContext();
  return (
    <div aria-live="polite" className="flex flex-col gap-4">
      {/* HEADER */}
      <div className="grid grid-cols-[4fr_4fr_1fr] gap-4 px-4 py-2 bg-(--color-bg-secondary) rounded-lg border border-(--color-border)">
        <p className="font-semibold text-sm text-(--color-text-secondary) cursor-default">Nombre</p>
        <p className="font-semibold text-sm text-(--color-text-secondary) cursor-default">
          Compañía
        </p>
        <p className="font-semibold text-sm text-(--color-text-secondary) text-right cursor-default">
          Año
        </p>
      </div>

      {/* RESULTS */}
      <div className="flex flex-col max-h-45 gap-2 overflow-y-auto scrollbar-thin hide-scrollbar">
        {participants &&
          participants.map((participant, index) => (
            <div
              key={index}
              className="grid grid-cols-[4fr_4fr_1fr] items-center gap-4 px-4 py-3 bg-(--color-bg-secondary) rounded-lg border border-(--color-border) hover:border-(--eye-catching-text) transition-colors"
            >
              <p className="text-sm font-medium cursor-default break-keep">{participant.name}</p>
              <p className="text-sm text-(--color-text-secondary) cursor-default break-keep">
                {participant.school}
              </p>
              <p className="text-sm text-(--color-text) text-right font-semibold cursor-default break-keep">
                {participant.year}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
