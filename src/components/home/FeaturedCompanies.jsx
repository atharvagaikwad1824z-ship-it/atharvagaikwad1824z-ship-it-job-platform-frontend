import "./FeaturedCompanies.css";

function FeaturedCompanies({ companies }) {
  return (
    <section className="companies">
      <div className="section-title">
        <h2>Top Companies Hiring</h2>
        <p>Work with industry leaders</p>
      </div>

      <div className="companies-grid">
        {companies.map((company) => (
          <div key={company._id} className="company-card">
            <img
              src={company.companyLogo || "/company.png"}
              alt={company.name}
            />
            <h4>{company.name}</h4>
            <p>{company.location || "Global"}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCompanies;
