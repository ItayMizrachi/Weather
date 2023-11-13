import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCityData } from "../../features/cities/citySlice";
import Forecast from "./Forecast";
import Now from "./Now";
import LaterToday from "./LaterToday";
import useWeatherApi from "../../../hooks/useWeatherApi";
import Map from "./Map";
import { Link } from "react-router-dom";
import CityNotFound from "./CityNotFound";
import ErrorMessage from "./ErrorMessage";

const Main = () => {
  let cityData = useSelector(selectCityData);
  const [fetchedKey, setFetchedKey] = useState(null);
  // Ensure cityData is always an array
  if (!Array.isArray(cityData)) {
    cityData = [cityData];
  }

  const {
    fetchWeatherData,
    fetchForecast,
    fetchHourlyData,
    currentWeather,
    forecast,
    hourlyData,
    error,
  } = useWeatherApi();

  useEffect(() => {
    if (
      cityData &&
      cityData.length > 0 &&
      cityData[0] &&
      cityData[0].Key &&
      cityData[0].Key !== fetchedKey
    ) {
      fetchWeatherData(cityData[0].Key);
      fetchForecast(cityData[0].Key);
      fetchHourlyData(cityData[0].Key);
      setFetchedKey(cityData[0].Key);
    }
  }, [cityData]);

  if (error) {
    return <ErrorMessage />;
  }

  if (!cityData || cityData.length === 0) {
    return <CityNotFound />;
  }

  return (
    <main className="grid grid-cols-1 lg:grid-cols-10 my-8">
      <section className="col-span-full lg:col-span-3 ">
        <Now currentWeather={currentWeather} />
        <h2 className="font-semibold text-xl ml-2 my-4">5 Days Forecast</h2>
        <div className="bg-base-200 rounded-xl shadow-md border border-base-300">
          {forecast &&
            forecast.DailyForecasts.map((day, index) => (
              <div key={index}>
                <Forecast day={day} index={index} />
              </div>
            ))}
        </div>
      </section>
      <section className="col-span-full lg:col-span-7 lg:ml-8 mt-8 lg:mt-0">
        <Map />
        <LaterToday hourlyData={hourlyData} />
      </section>
    </main>
  );
};

export default Main;
