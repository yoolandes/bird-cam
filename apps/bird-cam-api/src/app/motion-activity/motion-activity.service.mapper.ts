export const getHourCounts = (
  timestamps: string[]
): { [key: number]: number } => {
  const result = {};
  timestamps.forEach((timestamp) => {
    const date = new Date(timestamp);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    const key = date.toISOString();

    if (result[key]) {
      result[key] += 1;
    } else {
      result[key] = 1;
    }
  });
  return result;
};
