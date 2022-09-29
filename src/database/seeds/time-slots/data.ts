import { FlagEnum } from 'src/common/enums/flag.enum';

export const getDataTimeSlot = (): {
  startTime: string;
  endTime: string;
  flag: FlagEnum;
}[] => [
  {
    startTime: '6:00',
    endTime: '7:00',
    flag: FlagEnum.MORNING,
  },
  {
    startTime: '7:00',
    endTime: '8:00',
    flag: FlagEnum.MORNING,
  },
  {
    startTime: '8:00',
    endTime: '9:00',
    flag: FlagEnum.MORNING,
  },

  {
    startTime: '11:00',
    endTime: '12:00',
    flag: FlagEnum.NOON,
  },
  {
    startTime: '12:00',
    endTime: '13:00',
    flag: FlagEnum.NOON,
  },
  {
    startTime: '13:00',
    endTime: '14:00',
    flag: FlagEnum.NOON,
  },
  {
    startTime: '16:00',
    endTime: '17:00',
    flag: FlagEnum.AFTERNOON,
  },
  {
    startTime: '17:00',
    endTime: '18:00',
    flag: FlagEnum.AFTERNOON,
  },
  {
    startTime: '18:00',
    endTime: '19:00',
    flag: FlagEnum.AFTERNOON,
  },
];
