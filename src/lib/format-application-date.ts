import { format, isValid, parseISO } from "date-fns";

const APPLICATION_DATE_FORMAT = "do MMMM, yyyy";

export const formatApplicationDate = (timestamp: number): string =>
  format(new Date(timestamp), APPLICATION_DATE_FORMAT);

export const formatApplicationDateString = (
  value: string | undefined
): string | undefined => {
  if (!value?.trim()) {
    return undefined;
  }

  const parsedDate = parseISO(value);

  if (!isValid(parsedDate)) {
    return value;
  }

  return format(parsedDate, APPLICATION_DATE_FORMAT);
};
