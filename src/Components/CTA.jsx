import React from "react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-container animate-fade-in-up">
          <div className="row align-items-center">

            <div className="col-lg-7 col-12 mb-4 mb-lg-0 text-center text-lg-start">
              <h2 className="text-white mb-3 fw-bold display-5">
                Make an impact. <br /> Save lives.
              </h2>
              <p className="text-white-50 mb-0" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                Join our mission to provide essential resources, education, and healthcare to those who need it most. Every action, no matter how small, creates a ripple of positive change across the community.
              </p>
            </div>

            <div className="col-lg-5 col-12 d-flex flex-column flex-sm-row justify-content-center justify-content-lg-end gap-3 mt-4 mt-lg-0">
              <Link to="/donate" className="btn-premium bg-white px-4 py-3 border-0" style={{ color: 'var(--primary)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                Make a donation <i className="bi bi-arrow-right ms-2"></i>
              </Link>

              <a href="#volunteer" className="btn-premium btn-accent px-4 py-3">
                Become a volunteer
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;