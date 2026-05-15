import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="position-relative d-flex align-items-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--bg-main) 100%)', overflow: 'hidden', paddingTop: '80px' }}>
      
      {/* Decorative Blur Elements */}
      <div className="position-absolute rounded-circle" style={{ width: '400px', height: '400px', background: 'var(--primary)', filter: 'blur(100px)', opacity: '0.15', top: '-10%', right: '-5%' }}></div>
      <div className="position-absolute rounded-circle" style={{ width: '300px', height: '300px', background: 'var(--secondary)', filter: 'blur(80px)', opacity: '0.15', bottom: '10%', left: '-5%' }}></div>

      <div className="container position-relative z-1">
        <div className="row align-items-center">
          
          <div className="col-lg-6 mb-5 mb-lg-0 text-center text-lg-start animate-fade-in-up">
            <span className="badge-premium mb-3 d-inline-block">Welcome to Hope & Help</span>
            <h1 className="display-3 fw-bold mb-4" style={{ letterSpacing: '-1px' }}>
              Transforming Lives <br />
              <span className="text-gradient">Across India 🇮🇳</span>
            </h1>
            <p className="lead text-muted mb-5 pe-lg-5" style={{ fontSize: '1.2rem' }}>
              Your contribution can change a life. Join our community of everyday heroes working to uplift rural and urban communities nationwide.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
              <Link to="/donate" className="btn-premium btn-primary px-5 py-3">
                Donate Now <i className="bi bi-heart-fill ms-2"></i>
              </Link>
              <a href="#volunteer" className="btn-premium btn-secondary px-5 py-3">
                Become a Volunteer
              </a>
            </div>
            
            {/* Stats */}
            <div className="row mt-5 pt-4 border-top">
              <div className="col-4">
                <h3 className="fw-bold mb-0" style={{ color: 'var(--primary)' }}>50K+</h3>
                <small className="text-muted">Families Helped</small>
              </div>
              <div className="col-4 border-start border-end">
                <h3 className="fw-bold mb-0" style={{ color: 'var(--secondary)' }}>28</h3>
                <small className="text-muted">States Reached</small>
              </div>
              <div className="col-4">
                <h3 className="fw-bold mb-0" style={{ color: 'var(--accent)' }}>₹2.5Cr</h3>
                <small className="text-muted">Funds Raised</small>
              </div>
            </div>
          </div>

          <div className="col-lg-6 animate-fade-in-up delay-200">
            <div className="position-relative ms-lg-5">
              <div className="glass-card p-2 position-relative z-1" style={{ borderRadius: '24px' }}>
                <img
                  src="images/slide/volunteer-helping-with-donation-box.jpg"
                  alt="Volunteers helping"
                  className="img-fluid w-100"
                  style={{ borderRadius: '20px', objectFit: 'cover', height: '600px' }}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop'; }}
                />
              </div>
              
              {/* Floating Card */}
              <div className="position-absolute glass-card p-4 d-none d-md-block" style={{ bottom: '40px', left: '-40px', zIndex: '2' }}>
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-white rounded-circle p-3 shadow-sm text-success">
                    <i className="bi bi-check-circle-fill fs-4"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Verified Charity</h6>
                    <small className="text-muted">100% Secure Donations</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;  