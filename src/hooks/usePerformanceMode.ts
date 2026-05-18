import { useState, useEffect } from "react";

export function usePerformanceMode(): boolean {
  const [lowPower, setLowPower] = useState(false);
  useEffect(() => {
    setLowPower(navigator.hardwareConcurrency < 2);
  }, []);
  return lowPower;
}
