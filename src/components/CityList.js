import axios from "axios";
import React, { useState, useEffect } from "react";

const apiKey = "95f658f7075f434497404d873dc433c6";
const endpoint = `https://api.opencagedata.com/geocode/v1/json?q=India&countrycode=in&pretty=1&no_annotations=1&limit=10000&key=${apiKey}`;

function CityList() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { results = [] } = {} } = await axios.get(endpoint);
        const cityList =
          results
            ?.filter((result) => result?.components?.city)
            ?.map(({ components: { city }, geometry: { lat, lng } }) => ({
              name: city,
              latitude: lat,
              longitude: lng,
            })) ?? [];

        setCities(cityList);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  async function handleCityChange(event) {
    setSelectedCity(event.target.value);

    const selectedCityObj = cities.find(
      (item) => item && item.name === event.target.value
    );

    if (selectedCityObj) {
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${selectedCityObj.latitude}+${selectedCityObj.longitude}&key=95f658f7075f434497404d873dc433c6`;
      try {
        const response = await axios.get(url);
        const { data } = response;

        if (data.results.length > 0) {
          const results = data.results[0].components;
          setCity(
            results.city ||
              results.town ||
              results.village ||
              results.county ||
              ""
          );
          setState(results.state || "");
          setPincode(results.postcode || "");
        }
      } catch (error) {
        console.log("error", error);
      }
    } else {
      setCity("");
      setState("");
      setPincode("");
    }
  }

  return (
    <div>
      <h1>List of Cities in India</h1>
      <label htmlFor="city-dropdown">Select a city:</label>
      <select
        id="city-dropdown"
        value={selectedCity}
        onChange={handleCityChange}
      >
        <option value="">Select a city</option>
        {cities.map((city) => (
          <>
            {city?.name ? (
              <option key={city.name} value={city.name}>
                {city.name} ({city.latitude}, {city.longitude})
              </option>
            ) : null}
          </>
        ))}
      </select>
      <br />
      <br />
      {city && state && pincode ? (
        <>
          <hr />
          <h1>Selected City details</h1>
          <p>City: {city}</p>
          <p>State: {state}</p>
          <p>Pincode: {pincode}</p>
        </>
      ) : null}
    </div>
  );
}

export default CityList;
