export const redactEmail = (email: string): string => {
  const [username, domain] = email.split("@");
  const redactedUsername = `${username[0]}${"*".repeat(username.length - 2)}${
    username[username.length - 1]
  }`;
  const redactedDomain = `${domain[0]}${"*".repeat(domain.length - 2)}${
    domain[domain.length - 1]
  }`;
  return `${redactedUsername}@${redactedDomain}`;
};

export const redactName = (name: string): string => {
  // redact all but the first and last characters of each word
  return name.trim()
    .split(" ")
    .map((word) => {
      return `${word[0]}${"*".repeat(word.length - 2)}${word[word.length - 1]}`;
    })
    .join(" ");
};

export const redactPhone = (phone: string): string => {
  return `${phone.slice(0, 1)}${"*".repeat(phone.length - 4)}${phone.slice(
    phone.length - 3
  )}`;
};

export const redactAddress = (address: string): string => {
  // Split address into words and redact most of each word except first character
  return address
    .trim()
    .split(" ")
    .map((word) => {
      // Keep numbers and special characters as is
      if (/^\d+$/.test(word) || /^[^a-zA-Z0-9]+$/.test(word)) {
        return word;
      }
      // For words, keep first character and replace rest with asterisks
      return `${word[0]}${"*".repeat(Math.max(2, word.length - 1))}`;
    })
    .join(" ");
};
