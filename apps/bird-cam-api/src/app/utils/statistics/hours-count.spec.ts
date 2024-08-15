import { getHourCounts } from './hours-count';

describe('Get Hours Count', () => {
  it('should ', () => {
    const timestamps = [
      '2024-04-22T10:15:00Z',
      '2024-04-22T09:30:00Z',
      '2024-04-22T10:45:00Z',
      '2024-04-22T11:20:00Z',
      '2024-04-22T09:55:00Z',
      '2024-04-22T12:00:00Z',
      '2024-04-22T11:45:00Z',
    ];

    const result = getHourCounts(
      timestamps,
      new Date('2024-04-22T08:15:00Z'),
      new Date('2024-04-22T13:45:00Z')
    );

    console.log(result);
  });
});
