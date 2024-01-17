import { useState } from "react";

export default function useVendor() {
  const getVendor = () => {
    const vendorString = localStorage.getItem("vendor");
    const vendor = JSON.parse(vendorString);
    return vendor || null;
  };

  const [vendor, setVendor] = useState(getVendor());

  const saveVendor = (vendor) => {
    localStorage.setItem("vendor", JSON.stringify(vendor));
    setVendor(vendor);
  };

  return {
    setVendor: saveVendor,
    vendor,
  };
}
