export const redactEmail = (email: string): string => {
  if (!email || !email.includes("@")) return "***";

  const [username, domain] = email.split("@");
  if (!username || !domain) return "***";

  const mask = (value: string) => {
    if (value.length <= 2) return "*".repeat(value.length);
    return `${value[0]}${"*".repeat(value.length - 2)}${value[value.length - 1]}`;
  };

  return `${mask(username)}@${mask(domain)}`;
};

export const redactName = (name: string): string => {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      if (word.length <= 2) return "*".repeat(word.length);
      return `${word[0]}${"*".repeat(word.length - 2)}${word[word.length - 1]}`;
    })
    .join(" ");
};

export const redactPhone = (phone: string): string => {
  if (!phone) return "***";
  if (phone.length <= 4) return "*".repeat(phone.length);
  return `${phone.slice(0, 1)}${"*".repeat(phone.length - 4)}${phone.slice(-3)}`;
};

export const redactAddress = (address: string): string => {
  return address
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      if (/^\d+$/.test(word) || /^[^a-zA-Z0-9]+$/.test(word)) {
        return word;
      }
      if (word.length <= 1) return "*";
      return `${word[0]}${"*".repeat(Math.max(2, word.length - 1))}`;
    })
    .join(" ");
};

export const redactPincode = (pincode: string): string => {
  if (!pincode) return "******";
  if (pincode.length <= 2) return "*".repeat(pincode.length);
  return `${pincode[0]}${"*".repeat(pincode.length - 2)}${pincode[pincode.length - 1]}`;
};

export const redactCustomerInfo = (info: {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}) => ({
  name: redactName(info.name),
  email: redactEmail(info.email),
  phone: redactPhone(info.phone),
  address: redactAddress(info.address),
  city: redactAddress(info.city),
  state: redactAddress(info.state),
  pincode: redactPincode(info.pincode),
  landmark: info.landmark ? redactAddress(info.landmark) : undefined,
});
