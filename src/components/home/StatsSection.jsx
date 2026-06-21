import "./StatsSection.css";

function StatsSection({ jobs }) {
  return (
    <section className="stats">
      <div className="stats-box">
        <div className="stat">
          <h2>{jobs.length}+</h2>
          <p>Jobs Posted</p>
        </div>

        <div className="stat">
          <h2>100+</h2>
          <p>Companies</p>
        </div>

        <div className="stat">
          <h2>500+</h2>
          <p>Candidates</p>
        </div>

        <div className="stat">
          <h2>200+</h2>
          <p>Applications</p>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
