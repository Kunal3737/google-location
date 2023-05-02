import { Map, InfoWindow, GoogleApiWrapper } from "google-maps-react";
import { useEffect, useState } from "react";

const API_KEY = "ADD_YOUR_API_KEY";

const MapContainer = (props) => {
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    city: "",
    pincode: "",
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Call the Google Places API to get the city and pincode
        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
        )
          .then((response) => response.json())
          .then((data) => {
            const city = data.results[0].address_components.filter(
              (component) =>
                component.types.includes("locality") ||
                component.types.includes("administrative_area_level_2")
            )[0].long_name;

            const pincode = data.results[0].address_components.filter(
              (component) => component.types.includes("postal_code")
            )[0].long_name;

            setLocation({ lat, lng, city, pincode });
          })
          .catch((error) => console.log(error));
      },
      (error) => console.log(error)
    );
  }, []);

  return (
    <div>
      <Map
        google={props.google}
        initialCenter={{
          lat: location.lat,
          lng: location.lng,
        }}
        onReady={(mapProps, map) => {
          // Code to fetch the user's location
        }}
      >
        <InfoWindow>
          <div>
            <h4>{location.city}</h4>
            <p>{location.pincode}</p>
          </div>
        </InfoWindow>
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: API_KEY,
})(MapContainer);
