import React from 'react';

export const SkeletonBar = ({ w = '100%', h = 12, className = '', style }) => (
  <div className={`skeleton ${className}`} style={{ width: w, height: h, ...style }} />
);

const Status = ({ children }) => (
  <p role="status" className="sr-only">
    {children}
  </p>
);

/* One ledger row – matches the geometry of a ProjectCard */
export const SkeletonRow = ({ showFigure = true }) => (
  <>
    <div className="ledger-row">
      <div className="grid grid-cols-1 gap-x-8 md:grid-cols-12">
        <div className="md:col-span-2 md:mt-1.5">
          <SkeletonBar w="46px" h={9} />
        </div>
        <div className="order-last mt-4 md:order-none md:col-span-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <SkeletonBar w="min(320px, 60%)" h={18} />
            <SkeletonBar w="84px" h={9} />
          </div>
          <div className="mt-3 space-y-2">
            <SkeletonBar h={11} />
            <SkeletonBar w="88%" h={11} />
            <SkeletonBar w="54%" h={11} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <SkeletonBar w="62px" h={9} />
            <SkeletonBar w="48px" h={9} />
            <SkeletonBar w="70px" h={9} />
          </div>
        </div>
        {showFigure && (
          <div className="mt-4 md:col-span-2 md:mt-0">
            <SkeletonBar w="100%" className="aspect-[4/3]" />
          </div>
        )}
      </div>
    </div>
  </>
);

export const SkeletonIndex = ({ rows = 5, showFigure = true, label = 'Pulling records from the registry' }) => (
  <div aria-busy="true">
    <Status>{label}</Status>
    {Array.from({ length: rows }, (_, i) => (
      <SkeletonRow key={i} showFigure={showFigure} />
    ))}
  </div>
);

/* Blog index – reg column, headline, two summary rules, note ticks */
export const SkeletonNoteRow = () => (
  <div className="grid grid-cols-1 gap-x-8 border-b border-rule py-8 md:grid-cols-[112px_1fr_188px]">
    <div className="hidden md:block">
      <SkeletonBar w="72px" h={9} />
      <SkeletonBar w="58px" h={9} style={{ marginTop: 10 }} />
    </div>
    <div>
      <SkeletonBar w="min(420px, 72%)" h={20} />
      <div className="mt-3 space-y-2">
        <SkeletonBar h={11} />
        <SkeletonBar w="92%" h={11} />
        <SkeletonBar w="61%" h={11} />
      </div>
      <div className="mt-4 flex gap-2">
        <SkeletonBar w="76px" h={16} />
        <SkeletonBar w="64px" h={16} />
      </div>
    </div>
    <div className="hidden md:block">
      <SkeletonBar w="100%" className="aspect-[4/3]" />
    </div>
  </div>
);

export const SkeletonNoteIndex = ({ rows = 4, label = 'Pulling filed notes' }) => (
  <div aria-busy="true">
    <Status>{label}</Status>
    {Array.from({ length: rows }, (_, i) => (
      <SkeletonNoteRow key={i} />
    ))}
  </div>
);

/* The system map – a 2 x 2 survey of four plots */
export const SkeletonPlot = () => (
  <div className="border border-rule" aria-busy="true">
    <Status>Plotting filed systems</Status>
    <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-6">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="border border-rule bg-paper-strong p-4 sm:p-5">
          <SkeletonBar w="72px" h={9} />
          <SkeletonBar w="78%" h={17} style={{ marginTop: 12 }} />
          <SkeletonBar w="46%" h={9} style={{ marginTop: 8 }} />
          <div className="mt-5 flex items-center justify-between gap-3">
            <SkeletonBar w="58px" h={16} />
            <SkeletonBar w="64px" h={10} />
          </div>
        </div>
      ))}
    </div>
    <div className="border-t border-rule px-4 py-3 sm:px-6">
      <SkeletonBar w="280px" h={9} />
    </div>
  </div>
);

/* A case file sheet – reference rail, title, brief, plate, notes */
export const SkeletonSheet = ({ label = 'Opening the case file' }) => (
  <div aria-busy="true" className="container-page py-14">
    <Status>{label}</Status>
    <div className="mx-auto max-w-[72ch]">
      <SkeletonBar w="132px" h={10} />

      <div className="mt-8 border-y border-rule py-8">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <SkeletonBar w="78px" h={9} />
          <SkeletonBar w="96px" h={9} />
          <SkeletonBar w="120px" h={9} />
        </div>
        <SkeletonBar w="min(460px, 80%)" h={30} style={{ marginTop: 18 }} />
        <div className="mt-4 space-y-2">
          <SkeletonBar h={12} />
          <SkeletonBar w="86%" h={12} />
        </div>
      </div>

      <div className="mt-8 border border-rule bg-paper-strong p-2">
        <SkeletonBar w="100%" className="aspect-[16/9]" />
      </div>

      <div className="mt-8 space-y-2.5">
        <SkeletonBar h={12} />
        <SkeletonBar h={12} />
        <SkeletonBar w="94%" h={12} />
        <SkeletonBar w="78%" h={12} />
      </div>
    </div>
  </div>
);

export const SkeletonTableRows = ({ rows = 4, label = 'Opening the register' }) => (
  <div aria-busy="true">
    <Status>{label}</Status>
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="flex items-center gap-6 border-b border-rule py-4">
        <SkeletonBar w="42%" h={13} />
        <SkeletonBar w="16%" h={13} />
        <SkeletonBar w="10%" h={13} />
        <SkeletonBar w="64px" h={13} />
      </div>
    ))}
  </div>
);

export default SkeletonIndex;
