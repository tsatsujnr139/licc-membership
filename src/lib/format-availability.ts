type AvailabilityFields = {
  availableMonths?: string;
  availableYearRound?: "yes" | "no";
};

export const formatAvailability = ({
  availableMonths,
  availableYearRound,
}: AvailabilityFields): string => {
  if (availableYearRound === "yes") {
    return "Throughout the year";
  }

  if (availableYearRound === "no" && availableMonths?.trim()) {
    return availableMonths;
  }

  if (availableMonths?.trim()) {
    return availableMonths;
  }

  return "Not specified";
};
