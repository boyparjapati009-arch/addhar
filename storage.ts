const MAX_RECENT_SEARCHES = 5;

export const getRecentSearches = (key: string): string[] => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error(`Error reading "${key}" from localStorage`, error);
    return [];
  }
};

export const addRecentSearch = (key: string, value: string): string[] => {
  if (!value) return getRecentSearches(key);
  
  const searches = getRecentSearches(key);
  
  // Remove if already exists to move it to the top
  const filteredSearches = searches.filter(s => s !== value);
  
  const newSearches = [value, ...filteredSearches].slice(0, MAX_RECENT_SEARCHES);
  
  try {
    window.localStorage.setItem(key, JSON.stringify(newSearches));
  } catch (error) {
    console.error(`Error writing "${key}" to localStorage`, error);
  }
  
  return newSearches;
};
