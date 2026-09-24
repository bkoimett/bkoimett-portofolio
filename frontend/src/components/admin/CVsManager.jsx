import React, { useEffect, useRef, useState } from 'react';
import api from '../../utils/api';

const formatSize = (bytes) => {
  if (!bytes && bytes !== 0) return '–';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (value) => {
  if (!value) return '–';
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const CVsManager = () => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [label, setLabel] = useState('');
  const [makeActive, setMakeActive] = useState(true);
  const [note, setNote] = useState({ type: '', text: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const fileRef = useRef(null);
  const [pickedFile, setPickedFile] = useState(null);

  const loadCvs = async () => {
    try {
      const response = await api.get('/admin/cvs');
      setCvs(response.data);
    } catch {
      setNote({ type: 'error', text: 'Failed to load CV records' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCvs();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setPickedFile(file || null);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    const file = fileRef.current?.files[0];
    if (!file) {
      setNote({ type: 'error', text: 'Choose a PDF to file first' });
      return;
    }
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setNote({ type: 'error', text: 'Only PDF files are accepted' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setNote({ type: 'error', text: 'File is too large (max 10MB)' });
      return;
    }

    setUploading(true);
    setNote({ type: '', text: '' });
    try {
      const formData = new FormData();
      formData.append('cv', file);
      if (label.trim()) formData.append('label', label.trim());
      if (makeActive) formData.append('active', 'true');
      const response = await api.post('/admin/cvs', formData);
      setNote({ type: 'success', text: response.data.message });
      setLabel('');
      setMakeActive(true);
      setPickedFile(null);
      if (fileRef.current) fileRef.current.value = '';
      await loadCvs();
    } catch (error) {
      setNote({
        type: 'error',
        text: error.response?.data?.error || 'Failed to file CV',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSetActive = async (id) => {
    try {
      const response = await api.put(`/admin/cvs/${id}/active`);
      setNote({ type: 'success', text: response.data.message });
      await loadCvs();
    } catch {
      setNote({ type: 'error', text: 'Failed to update CV status' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/admin/cvs/${id}`);
      setNote({ type: 'success', text: response.data.message });
      setConfirmDeleteId(null);
      await loadCvs();
    } catch {
      setNote({ type: 'error', text: 'Failed to delete CV record' });
    }
  };

  return (
    <section aria-labelledby="cv-records">
      <header className="border-b border-rule pb-6">
        <p className="file-index-sm">REGISTRY – BK / CV</p>
        <h2
          id="cv-records"
          className="mt-1 text-heading font-semibold text-ink"
        >
          Curriculum vitae
        </h2>
        <p className="mt-2 max-w-[62ch] text-body-sm text-ink-muted">
          File new versions of your CV and choose which one visitors can
          download. Only the active record is served publicly.
        </p>
      </header>

      {note.text && (
        <p
          className={`mt-6 border px-4 py-2.5 font-mono text-[13px] ${
            note.type === 'error'
              ? 'border-stamp text-stamp'
              : 'border-registry text-registry'
          }`}
        >
          {note.text}
        </p>
      )}

      <form
        onSubmit={handleUpload}
        className="card-flat mt-6 rounded-[2px] px-5 py-6"
      >
        <p className="file-index-sm">FILE A NEW CV</p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="cv-file"
              className="file-index-sm block text-ink"
            >
              PDF file
            </label>
            <input
              id="cv-file"
              ref={fileRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              className="input-base mt-1 w-full"
            />
            {pickedFile && (
              <p className="file-index-sm mt-1.5 text-ink-muted">
                {pickedFile.name} · {formatSize(pickedFile.size)}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="cv-label" className="file-index-sm block text-ink">
              Version label (optional)
            </label>
            <input
              id="cv-label"
              type="text"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="e.g. 2026 Full-Stack CV"
              className="input-base mt-1 w-full"
            />
          </div>
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={makeActive}
            onChange={(event) => setMakeActive(event.target.checked)}
            className="h-4 w-4 accent-registry"
          />
          <span className="text-[14px] text-ink">
            Make this the downloadable CV
          </span>
        </label>
        <div className="mt-5 flex items-center gap-4">
          <button
            type="submit"
            disabled={uploading}
            className="btn btn-primary"
          >
            {uploading ? 'Filing…' : 'File CV'}
          </button>
          {makeActive && cvs.length > 0 && (
            <p className="file-index-sm text-ink-muted">
              Replaces the current downloadable record
            </p>
          )}
        </div>
      </form>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-rule-strong text-left">
              <th className="pb-2 pr-4 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
                Record
              </th>
              <th className="pb-2 pr-4 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
                File
              </th>
              <th className="pb-2 pr-4 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
                Size
              </th>
              <th className="pb-2 pr-4 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
                Filed
              </th>
              <th className="pb-2 pr-4 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
                Status
              </th>
              <th className="pb-2 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-6 font-mono text-[13px] text-ink-muted"
                >
                  Opening the CV files…
                </td>
              </tr>
            ) : cvs.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-6 font-mono text-[13px] text-ink-muted"
                >
                  No CVs on file yet. File the first record above.
                </td>
              </tr>
            ) : (
              cvs.map((cv) => {
                const confirming = confirmDeleteId === cv.id;
                return (
                  <tr
                    key={cv.id}
                    className="border-b border-rule text-[14px] hover:bg-paper-strong/60"
                  >
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-ink">
                        {cv.label || cv.fileName}
                      </p>
                      {cv.label && (
                        <p className="font-mono text-[12px] text-ink-muted">
                          {cv.fileName}
                        </p>
                      )}
                    </td>
                    <td className="py-3 pr-4 font-mono text-[12px] text-ink-muted">
                      {cv.fileName}
                    </td>
                    <td className="py-3 pr-4 font-mono text-[12px] text-ink-muted">
                      {formatSize(cv.size)}
                    </td>
                    <td className="py-3 pr-4 font-mono text-[12px] text-ink-muted">
                      {formatDate(cv.createdAt)}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-block border px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] ${
                          cv.active
                            ? 'border-registry text-registry'
                            : 'border-rule-strong text-ink-muted'
                        }`}
                      >
                        {cv.active ? 'Active' : 'On file'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {confirming ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="font-mono text-[12px] text-stamp">
                            Delete?
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDelete(cv.id)}
                            className="border border-stamp px-2 py-0.5 font-mono text-[12px] text-stamp hover:bg-stamp hover:text-paper"
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="border border-rule-strong px-2 py-0.5 font-mono text-[12px] text-ink-muted hover:text-ink"
                          >
                            No
                          </button>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-3">
                          {!cv.active && (
                            <button
                              type="button"
                              onClick={() => handleSetActive(cv.id)}
                              className="filigree text-[14px] font-medium"
                            >
                              Make active
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(cv.id)}
                            className="text-[14px] font-medium text-ink-muted hover:text-stamp"
                          >
                            Delete
                          </button>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CVsManager;