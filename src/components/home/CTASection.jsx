import { Link } from "react-router-dom";
import "./CTASection.css";

function CTASection() {
  return (
    <section className="cta">
      <div className="cta-box">
        <h2>Are you an Employer?</h2>
        <p>Post your jobs and hire the best candidates easily.</p>

        <Link to="/post-job" className="cta-btn">
          Post a Job
        </Link>
      </div>
    </section>
  );
}

export default CTASection;
