import React, { useState, useEffect } from "react";
import useApi from "../hooks/useApi";

const LocationInfo = ({ latitude, longitude }) => {
  const { data, isLoading, error } = useApi(
    `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=95f658f7075f434497404d873dc433c6`
  );
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    if (!data) return;

    const { results } = data;

    if (results && results.length > 0) {
      const { components } = results[0];

      setCity(
        components.city ||
          components.town ||
          components.village ||
          components.county ||
          ""
      );

      setState(components.state || "");
      setPincode(components.postcode || "");
    }
  }, [data]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <p>City: {city}</p>
      <p>State: {state}</p>
      <p>Pincode: {pincode}</p>
    </div>
  );
};

export default LocationInfo;
