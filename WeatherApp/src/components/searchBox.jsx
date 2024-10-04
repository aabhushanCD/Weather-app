import { useState, useEffect } from "react";

export default function SearchBox({ onSearch, countryList }) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isComplete, setIsComplete] = useState(false); // To track if the user has completed typing

  // Debounce implementation
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (isComplete) {
        onSearch(inputValue);  // Trigger the search if the user stops typing
      }
    }, 500); // 500ms debounce time

    return () => clearTimeout(debounceTimeout);  // Cleanup
  }, [inputValue, isComplete, onSearch]);

  const handleChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    setIsComplete(false); // Set to false since the user is still typing

    // Update suggestions based on the input value
    if (value.length > 0) {
      const filteredSuggestions = countryList.filter((country) =>
        country.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]); // Clear suggestions if no input
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsComplete(true); // Mark as complete when the form is submitted
    if (inputValue) {
      onSearch(inputValue); // Trigger the search on form submission
    }
    setSuggestions([]); // Clear suggestions after submitting
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]); // Clear suggestions once the user clicks on one
    setIsComplete(true);
    onSearch(suggestion); // Trigger the search with the clicked suggestion
  };

  return (
    <form onSubmit={handleSubmit} className="searchBox">
      <div className="searchBox">
        <label htmlFor="search">Search:</label>
        <input
          type="search"
          id="search"
          value={inputValue}
          onChange={handleChange}
          required
        />
        <button type="submit">Search</button>
      </div>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
