export const getStoredThemeMode = () => {
  try {
    return localStorage.getItem('themeMode') === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
};

/** Apply light/dark class on <html> — call before React mount to avoid flash */
export const applyThemeToDocument = (mode) => {
  const root = document.documentElement;
  if (mode === 'light') {
    root.classList.remove('dark');
    root.classList.add('light');
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
  }
};
