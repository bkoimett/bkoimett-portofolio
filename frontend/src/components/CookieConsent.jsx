import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'cookie-consent';

const CookieConsent = () => {
  const [choice, setChoice] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const reopen = () => setChoice(null);
    window.addEventListener('open-cookie-consent', reopen);
    return () => window.removeEventListener('open-cookie-consent', reopen);
  }, []);

  const decide = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* storage unavailable: banner stays dismissed for the session */
    }
    setChoice(value);
  };

  if (choice) return null;

  return (
    <aside
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-rule-strong bg-paper-strong"
    >
      <div className="container-page py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-[52ch]">
            <p className="file-index-sm uppercase tracking-[0.12em]">
              BK / NOTICE - COOKIES
            </p>
            <p className="mt-1 text-body-sm text-ink-muted">
              This site sets no tracking cookies. Your theme and session
              preferences are kept only in your own browser. You may accept or
              reject this notice.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => decide('rejected')}
              className="btn btn-stroke text-sm"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => decide('accepted')}
              className="btn btn-primary text-sm"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CookieConsent;