import api from './api';

const downloadPath = `${api.defaults.baseURL}/cv/download`;

export const cvDownloadUrl = downloadPath;

export const cvShareUrl = () => new URL(downloadPath, window.location.origin).href;

export const fetchActiveCv = async ({ signal } = {}) => {
  try {
    const response = await api.get('/cv', { signal });
    return response.data;
  } catch {
    return null;
  }
};

export const copyCvLink = async () => {
  const url = cvShareUrl();
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = url;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
  return url;
};