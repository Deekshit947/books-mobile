import {useEffect, useState} from 'react';

export function useSlowRequest(isLoading: boolean, delay = 3500): boolean {
  const [isSlow, setIsSlow] = useState(false);
  useEffect(() => {
    if (!isLoading) {setIsSlow(false); return;}
    const timer = setTimeout(() => setIsSlow(true), delay);
    return () => clearTimeout(timer);
  }, [delay, isLoading]);
  return isSlow;
}
