import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="cta-section" id="contact">
      <div className="container">
        <div className="cta-content">
          <h2>Ready to Transform Your Fundraising?</h2>
          <p>Join thousands of founders and investors building the future</p>
          <div className="cta-buttons">
            <Link to="/signup/founder" className="btn btn-primary btn-large">For Founders - Start Free</Link>
            <Link to="/signup/investor" className="btn btn-outline btn-large">For Investors - Request Access</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

