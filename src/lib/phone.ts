import libphonenumber from "google-libphonenumber";
import { parsePhoneNumber } from "libphonenumber-js";

const { PhoneNumberUtil } = libphonenumber;

export const formatPhoneNumberForSubmit = (value: string) => {
  if (!value) {
    return "";
  }

  try {
    const phoneNumber = parsePhoneNumber(value);

    if (phoneNumber) {
      return `${phoneNumber.countryCallingCode}${phoneNumber.nationalNumber}`;
    }
  } catch {
    // Fall through to strip the leading + from E.164 values.
  }

  return value.replace(/^\+/u, "");
};

export const isValidPhoneNumber = (value: string) => {
  const normalized = value.replace(/^\+/u, "");

  // google-libphonenumber doesn't recognize the new Ghanaian phone numbers as valid
  if (normalized.startsWith("23353")) {
    return true;
  }

  try {
    const phoneUtil = PhoneNumberUtil.getInstance();
    return phoneUtil.isValidNumber(phoneUtil.parse(`+${normalized}`));
  } catch {
    return false;
  }
};
