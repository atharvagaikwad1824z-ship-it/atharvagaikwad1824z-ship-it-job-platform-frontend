import { useEffect, useState } from "react";
import { getAllJobs } from "../services/jobService";
import HeroSection from "../components/home/HeroSection";
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturedJobs from "../components/home/FeaturedJobs";
import StatsSection from "../components/home/StatsSection";
import CTASection from "../components/home/CTASection";
//import "./Home.css";

function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // categories derived from jobs
  const categories = [...new Set(jobs.map((job) => job.category))];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getAllJobs();
        setJobs(res.data);
      } catch (err) {
        console.log("Error fetching jobs:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();``
  }, []);

  return (
    <div className="home-container">
      <HeroSection jobs={jobs} />

      <CategoriesSection categories={categories} />

      <FeaturedJobs jobs={jobs.slice(0, 6)} loading={loading} />

      <StatsSection jobs={jobs} />

      <CTASection />
    </div>
  );
}

export default Home;
