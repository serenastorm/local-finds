export type WeekDay =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

type OpenWeekDay = {
  weekDay: WeekDay;
  isOpen: true;
  openingTime: Date;
  closingTime: Date;
};

type ClosedWeekDay = {
  weekDay: WeekDay;
  isOpen: false;
  openingTime?: never;
  closingTime?: never;
};

export type WeekdayWithOpeningTimes = OpenWeekDay | ClosedWeekDay;
