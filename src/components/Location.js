import { useState, useEffect } from "react";
import LocationInfo from "./LocationInfo";

const Location = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setLocation("Permission denied");
      }
    );
  }, []);

  return (
    <div>
      {location ? (
        <p>
          Your current location is
          <LocationInfo latitude={location.lat} longitude={location.lng} />
        </p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Location;
