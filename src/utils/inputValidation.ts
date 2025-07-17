export interface FormData {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
  message?: string;
}

export interface FormErrors {
  [key: string]: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
  return phoneRegex.test(phone);
};

const validatePincode = (pincode: string): boolean => {
  const pincodeRegex = /^[1-9][0-9]{5}$/; // Indian pincode format
  return pincodeRegex.test(pincode);
};

export const validateForm = (
  formData: Partial<FormData>,
  fieldsToValidate: (keyof FormData)[]
): FormErrors => {
  const errors: FormErrors = {};

  fieldsToValidate.forEach((field) => {
    const error = validateField(field, formData[field] || "");
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

export const validateField = (field: keyof FormData, value: string): string => {
  switch (field) {
    case "name":
      if (!value.trim()) {
        return "Name is required";
      } else if (value.trim().length < 2) {
        return "Name must be at least 2 characters long";
      }
      break;

    case "email":
      if (!value.trim()) {
        return "Email is required";
      } else if (!validateEmail(value)) {
        return "Please enter a valid email address";
      }
      break;

    case "phone":
      if (!value.trim()) {
        return "Phone number is required";
      } else if (!validatePhone(value)) {
        return "Please enter a valid 10-digit Indian mobile number";
      }
      break;

    case "address":
      if (!value.trim()) {
        return "Address is required";
      } else if (value.trim().length < 10) {
        return "Please enter a complete address (at least 10 characters)";
      }
      break;

    case "city":
      if (!value.trim()) {
        return "City is required";
      }
      break;

    case "state":
      if (!value.trim()) {
        return "State is required";
      }
      break;

    case "pincode":
      if (!value.trim()) {
        return "Pincode is required";
      } else if (!validatePincode(value)) {
        return "Please enter a valid 6-digit pincode";
      }
      break;

    case "message":
      if (!value.trim()) return "Message is required";
      if (value.trim().length < 10)
        return "Please enter at least 10 characters";
      break;

    default:
      break;
  }
  return "";
};
