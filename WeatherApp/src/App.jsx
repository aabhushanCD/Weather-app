import Header from "./components/Header";
import "./App.css";
import countries from "./store/countrys.json"; // Import your countries JSON
import { useEffect, useState } from "react";
import SearchBox from "./components/searchBox";

function App() {
  const [apiData, setApiData] = useState({
    temperature: null, // Initialize temperature as null to avoid rendering an object
    weatherDescription: "",
    countryName: "",
  });
  const [searched, setSearched] = useState(""); // State for the searched country
  const apiKey = "f011c8481591a4c6f1f9fd818f62e38c"; // Your API key

  // Function to handle search term
  const handleSearch = (searchTerm) => {
    const countryMatch = countries.countries.find(
      (country) => country.name.toLowerCase() === searchTerm.toLowerCase()
    );
    if (countryMatch) {
      setSearched(countryMatch.name); // Set the searched country if found
    } else {
      console.log("Country not found");
    }
  };

  // API URL is constructed based on the searched country
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${searched}&appid=${apiKey}&units=metric`;

  // useEffect to fetch weather data when the `searched` state changes
  useEffect(() => {
    if (searched) {
      // Only fetch data when a country has been searched
      fetch(url)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok: " + res.statusText);
          }
          return res.json(); // Parse the JSON data from the response
        })
        .then((data) => {
          // Update the apiData state with the fetched weather data
          setApiData({
            countryName: data.name, // Country name from the API
            temperature: data.main.temp, // Temperature data from the API
            weatherDescription: data.weather[0].description, // Weather description
          });
        })
        .catch((error) => {
          // Handle errors gracefully by logging them
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  }, [searched, url]); // Trigger the effect when `searched` or `url` changes

  return (
    <>
      <Header />
      <div id="main-content">
        <section>
          {/* Pass the handleSearch function to the SearchBox and country list */}
          <SearchBox
            onSearch={handleSearch}
            countryList={countries.countries.map((country) => country.name)} // Map the countries JSON to an array of names
          />
          {/* Display the country name */}
          <h1>{apiData.countryName || "No country selected"}</h1>

          {/* Conditionally render weather data if country is selected */}
          {apiData.countryName && (
            <>
              <img
                src="https://i.pinimg.com/736x/74/fc/34/74fc346aeef86e573869fa50546d715b.jpg"
                alt="Cloud"
                width="150px"
                height="150px"
              />
              <span>
                Temp:{" "}
                {typeof apiData.temperature === "number"
                  ? `${apiData.temperature}°C`
                  : "N/A"}{" "}
                / Description: {apiData.weatherDescription || "N/A"}
              </span>
            </>
          )}
        </section>
      </div>
    </>
  );
}

export default App;
