import React, { useEffect, useRef, useCallback } from 'react';

const ExpandableImage = ({ src, alt = '', className = '', caption = '' }) => {
  const [open, setOpen] = React.useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close]);

  if (!src) return null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge figure: ${alt || caption || 'full image'}`}
        title="View full figure"
        className="block w-full cursor-zoom-in text-left"
      >
        <img src={src} alt={alt} className={className} />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Enlarged figure: ${alt || caption || 'full image'}`}
          tabIndex={-1}
          onClick={close}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-paper/95 p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close enlarged figure"
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center border border-rule-strong bg-paper text-ink transition-colors hover:border-registry hover:text-registry"
          >
            <span aria-hidden="true" className="font-mono text-sm">✕</span>
          </button>
          <figure onClick={(e) => e.stopPropagation()} className="max-h-full max-w-full">
            <img
              src={src}
              alt={alt}
              className="max-h-[86vh] max-w-full border border-rule bg-paper object-contain"
            />
            <figcaption className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
              FIG. {caption || alt || 'full figure'}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
};

export default ExpandableImage;