export const getDataFrame = (): {
  name: string;
  dateFilter: number;
}[] => [
  {
    name: 'Frame 5 days (T2 => T6 ST)',
    dateFilter: 224688,
  },
  {
    name: 'Frame 6 days (T2 => T7 ST)',
    dateFilter: 224694,
  },
  {
    name: 'Frame 3 days (T2 T4 T6 ST)',
    dateFilter: 199728,
  },
];
