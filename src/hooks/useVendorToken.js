import { useState } from "react";

export default function useVendorToken() {
  const getVendorToken = () => {
    const vendorTokenString = localStorage.getItem("vendorToken");
    const vendorToken = JSON.parse(vendorTokenString);
    return vendorToken || null;
  };

  const [vendorToken, setVendorToken] = useState(getVendorToken());

  const saveVendorToken = (vendorToken) => {
    localStorage.setItem("vendorToken", JSON.stringify(vendorToken));
    setVendorToken(vendorToken);
  };

  return {
    setVendorToken: saveVendorToken,
    vendorToken,
  };
}
