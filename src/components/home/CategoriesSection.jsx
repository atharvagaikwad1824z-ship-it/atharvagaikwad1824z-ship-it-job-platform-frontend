import "./CategoriesSection.css";

function CategoriesSection({ categories }) {
  return (
    <section className="categories">
      <div className="section-title">
        <h2>Popular Categories</h2>
        <p>Explore jobs by category</p>
      </div>

      <div className="categories-grid">
        {categories.map((cat, index) => (
          <div key={index} className="category-card">
            <h3>{cat}</h3>
            <span>Open Positions</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategoriesSection;
