import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3>JobPlatform</h3>
          <p>Your career starts here.</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <a href="/jobs">Jobs</a>
          <a href="/dashboard">Dashboard</a>
        </div>

        <div>
          <h4>Support</h4>
          <a href="#">Help Center</a>
          <a href="#">Contact</a>
        </div>
      </div>

      <p className="footer-copy">
        © {new Date().getFullYear()} JobPlatform. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
