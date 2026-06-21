import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HeroSection.css";

function HeroSection({ jobs }) {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?keyword=${keyword}&location=${location}`);
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Find Your <span>Dream Job</span> Today
        </h1>
        <p>
          Search thousands of jobs from top companies and apply instantly.
        </p>

        <form className="hero-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Job title or keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <button type="submit">Search</button>
        </form>

        <div className="hero-stats">
          <p>
            <strong>{jobs.length}+</strong> Jobs Available
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
