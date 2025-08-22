import React, { useCallback, useContext, useState } from "react";
import { EnvContext } from "../../App";
import axios from "axios";

const useGetCurrentLocation = () => {
  const { location_api_key } = useContext(EnvContext);
  const [currentAddress, setCurrentAddress] = useState({});
  const [LocationSpin, setLocationSpin] = useState(false);
  const [error, setError] = useState("");

  //   fetching user current location
  const getCurrentLocation = useCallback(() => {
    setLocationSpin(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C+${longitude}&key=${location_api_key}`;
          axios
            .get(url)
            .then((response) => {
              const comp = response.data.results[0].components;
              const address = {
                village: comp.village || "",
                town: comp.town || "",
                city: comp.city || "",
                district: comp.state_district || "",
                state: comp.state || "",
                pincode: comp.postcode || "",
                fullAddress: response.data.results[0].formatted,
              };
              setCurrentAddress(address);
              setLocationSpin(false);
            })
            .catch((error) => {
              console.error(error);
              setLocationSpin(false);
              setError("Error getting location try again");
            });
        },
        (error) => {
          console.error("Error getting location", error.message);
          setLocationSpin(false);
          setError("Error getting location try again", error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      setLocationSpin(false);
      setError("Geolocation is not supported by this browser.");
    }
  }, [location_api_key]);

  return { getCurrentLocation, currentAddress, LocationSpin, error };
};

export default useGetCurrentLocation;
