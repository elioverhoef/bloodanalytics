// Statistical utility functions
export const calculateCorrelation = (x: number[], y: number[]): number => {
  const n = x.length;
  if (n !== y.length || n === 0) return 0;

  const sum1 = x.reduce((a, b) => a + b);
  const sum2 = y.reduce((a, b) => a + b);
  const sum1Sq = x.reduce((a, b) => a + b * b);
  const sum2Sq = y.reduce((a, b) => a + b * b);
  const pSum = x.reduce((a, b, i) => a + b * y[i], 0);

  const num = pSum - (sum1 * sum2 / n);
  const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));

  return den === 0 ? 0 : num / den;
};

export const calculatePValue = (correlation: number, n: number): number => {
  const t = correlation * Math.sqrt((n-2)/(1-correlation*correlation));
  return 2 * (1 - Math.min(1, Math.exp(-0.717 * t - 0.416 * t * t)));
};