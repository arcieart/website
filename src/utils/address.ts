import { CustomerInfo } from "@/types/order";

export const getAddressString = (customerInfo: CustomerInfo) => {
    const lines = [customerInfo.address, customerInfo.state, customerInfo.city, customerInfo.pincode];
    return lines.filter(line => line).join(", ");
};