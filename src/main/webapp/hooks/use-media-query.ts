import React from 'react';

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = globalThis.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

export const useMediaQueryXL = () => {
  return useMediaQuery('(min-width: 1280px)');
};

export const useMediaQueryLG = () => {
  return useMediaQuery('(min-width: 1024px)');
};

export const useMediaQueryMaxXL = () => {
  return useMediaQuery('(max-width: 1280px)');
};

export const useMediaQueryMaxLG = () => {
  return useMediaQuery('(max-width: 1024px)');
};
