import { useState, useEffect } from "react";

export function usePerformanceMode(): boolean {
  const [lowPower, setLowPower] = useState(false);
  useEffect(() => {
    setLowPower(window.innerWidth < 768 || navigator.hardwareConcurrency < 4);
  }, []);
  return lowPower;
}
