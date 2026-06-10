const STORAGE_KEY = "savedCareers";

export function getSavedCareers() {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    return [];
  }
}

export function saveCareer(career) {
  const saved = getSavedCareers();
  const exists = saved.some((item) => item.title === career.title);
  if (exists) return saved;
  const updated = [...saved, career];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function removeSavedCareer(title) {
  const saved = getSavedCareers();
  const updated = saved.filter((item) => item.title !== title);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
