export const getHourCounts = (
  timestamps: string[],
  lowerDate: Date,
  upperDate: Date
): { [key: number]: number } => {
  const result = {};

  let currentDate = lowerDate;
  currentDate.setMinutes(0);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);

  while (currentDate < upperDate) {
    const key = currentDate.toISOString();
    result[key] = 0;
    currentDate.setHours(currentDate.getHours() + 1);
  }

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
