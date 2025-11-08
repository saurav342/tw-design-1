import { Link } from 'react-router-dom';

const FooterEX1 = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🚀</span>
            <span className="logo-text">Launch and Lift</span>
          </Link>
          <p>AI-powered infrastructure for modern startup fundraising</p>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Launch and Lift. All rights reserved.</p>
        </div>
      </div>
      <div className="footer-gradient"></div>
    </footer>
  );
};

export default FooterEX1;

