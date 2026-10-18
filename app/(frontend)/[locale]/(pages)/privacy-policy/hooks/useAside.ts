import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';

/**
 * State of the table of contents: the section being read (tracked with an IntersectionObserver)
 * and the modal <dialog> that shows it on small screens.
 */
export function useAside(sectionIds: string[]) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeId, setActiveId] = useState(sectionIds[0]);
  const [open, setOpen] = useState(false);

  // A thin band near the top of the viewport: the section crossing it is the one being read
  const idsKey = sectionIds.join(',');
  useEffect(() => {
    const elements = idsKey
      .split(',')
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries.find((entry) => entry.isIntersecting);
        if (entering) setActiveId(entering.target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [idsKey]);

  const openDialog = useCallback(() => {
    dialogRef.current?.showModal();
    setOpen(true);
  }, []);

  // The dialog's `close` event (see handleClose) keeps `open` in sync
  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  // Fired for every way of closing: Escape, closeDialog(), a click on the backdrop...
  const handleClose = useCallback(() => setOpen(false), []);

  // A click on the backdrop lands on the <dialog> element itself, not on its content
  function handleDialogClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) closeDialog();
  }

  // Lock the page scroll while the dialog is open, and restore it afterwards
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return { activeId, dialogRef, open, openDialog, closeDialog, handleClose, handleDialogClick };
}
