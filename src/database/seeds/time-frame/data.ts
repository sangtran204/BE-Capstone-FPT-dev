export const getDataFrame = (): {
  name: string;
  dateFilter: string;
}[] => [
  {
    name: 'Frame 5 days (T2 => T6 ST)',
    dateFilter: '110110110110110',
  },
  {
    name: 'Frame 6 days (T2 => T7 ST)',
    dateFilter: '110110110110110110',
  },
  {
    name: 'Frame 3 days (T2 T4 T6 ST)',
    dateFilter: '110000110000110',
  },
];
