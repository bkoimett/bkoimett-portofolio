import React from 'react';
import RichText from './RichText';
import { getCaseNote, isConsoleCopy } from '../../data/caseNotes';

/* Case notes for one record. Copy typed into the console wins, because it is
   the record's own words. The authored notes fill every record that has none.
   A record with neither says so and points at the source rather than repeating
   its brief. */
const CaseNotes = ({ project }) => {
  const note = getCaseNote(project);
  const consoleCopy = project.content && !isConsoleCopy(project.content) ? project.content : null;

  if (!note && !consoleCopy) {
    return (
      <div className="mt-10 border-y border-rule py-8">
        <h2 className="text-title font-semibold text-ink">Case notes</h2>
        <p className="mt-2 max-w-[62ch] text-body text-ink-muted">
          {project.description} The written notes for this record have not been filed
          yet. The source carries the implementation.
        </p>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="filigree mt-4 inline-block text-[15px] font-medium"
          >
            Read the source
          </a>
        )}
      </div>
    );
  }

  if (consoleCopy) {
    return (
      <div className="mt-10">
        <h2 className="text-title font-semibold text-ink">Case notes</h2>
        <RichText text={consoleCopy} className="mt-4" />
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-title font-semibold text-ink">Case notes</h2>
      <p className="mt-3 max-w-[64ch] text-[1.125rem] leading-relaxed text-ink">
        {note.standfirst}
      </p>

      <div className="mt-8">
        {note.sections.map((section) => (
          <section key={section.heading} className="mt-8 first:mt-0">
            <h3 className="border-b border-rule pb-2 text-title-sm font-semibold text-ink">
              {section.heading}
            </h3>
            {section.body?.map((paragraph) => (
              <p key={paragraph} className="mt-4 max-w-[64ch] text-body text-ink-muted">
                {paragraph}
              </p>
            ))}
            {section.list && (
              <ul className="filing-list mt-4 max-w-[64ch] space-y-2 text-body text-ink-muted">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default CaseNotes;
