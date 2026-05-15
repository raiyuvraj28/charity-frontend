import React from "react";

function About() {
  return (
    <section className="section-padding section-bg" id="About" style={{ backgroundColor: 'var(--primary-light)' }}>
      <div className="container py-5">
        <div className="row align-items-center">
          
          {/* Left Image */}
          <div className="col-lg-6 col-12 mb-5 mb-lg-0 pe-lg-5">
            <div className="position-relative">
              <div className="rounded-circle position-absolute" style={{ width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(80px)', opacity: '0.2', top: '-10%', left: '-10%' }}></div>
              <img
                src="images/group.jpeg"
                className="img-fluid position-relative z-1 shadow-lg"
                style={{ borderRadius: '24px', objectFit: 'cover', height: '500px', width: '100%' }}
                alt="Helping people in India"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop'; }}
              />
              <div className="position-absolute glass-card p-4 text-center z-2" style={{ bottom: '-30px', right: '-20px', borderRadius: '20px' }}>
                <h3 className="fw-bold mb-0 text-gradient">10+ Years</h3>
                <span className="text-muted fw-semibold">of Experience</span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="col-lg-6 col-12">
            <span className="badge-premium mb-3">Our Story</span>
            <h2 className="display-5 fw-bold mb-4">Empowering Lives Across <span style={{color: 'var(--primary)'}}>India 🇮🇳</span></h2>

            <p className="lead text-muted mb-4" style={{ fontSize: '1.1rem' }}>
              Hope & Help Foundation is a non-profit organization dedicated to improving 
              the lives of underprivileged communities across India. From rural villages 
              to urban slums, we focus on providing food, education, and healthcare 
              support to those in need.
            </p>

            <div className="row mt-5">
              {/* Mission */}
              <div className="col-lg-7 col-md-6 col-12 mb-4 mb-md-0">
                <h5 className="fw-bold mb-3" style={{ color: 'var(--primary-dark)' }}>Our Mission</h5>
                <p className="text-muted mb-4">
                  To create a better India by supporting poor and needy people through essential services and opportunities.
                </p>

                <ul className="list-unstyled mb-0" style={{ gap: '15px', display: 'flex', flexDirection: 'column' }}>
                  <li className="d-flex align-items-center">
                    <div className="rounded-circle d-flex justify-content-center align-items-center me-3 shadow-sm" style={{ width: '35px', height: '35px', background: 'white', color: 'var(--primary)' }}>
                      <i className="bi bi-check-lg fw-bold"></i>
                    </div>
                    <span className="fw-medium">Free Education for Children</span>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="rounded-circle d-flex justify-content-center align-items-center me-3 shadow-sm" style={{ width: '35px', height: '35px', background: 'white', color: 'var(--secondary)' }}>
                      <i className="bi bi-check-lg fw-bold"></i>
                    </div>
                    <span className="fw-medium">Food Distribution Drives</span>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="rounded-circle d-flex justify-content-center align-items-center me-3 shadow-sm" style={{ width: '35px', height: '35px', background: 'white', color: 'var(--accent)' }}>
                      <i className="bi bi-check-lg fw-bold"></i>
                    </div>
                    <span className="fw-medium">Medical Camps in Rural Areas</span>
                  </li>
                </ul>
              </div>

              {/* Counters */}
              <div className="col-lg-5 col-md-6 col-12">
                <div className="glass-card p-4 h-100 d-flex flex-column justify-content-center" style={{ borderRadius: '20px' }}>
                  <div className="mb-4">
                    <h3 className="fw-bold mb-0" style={{ color: 'var(--primary)' }}>2015</h3>
                    <span className="text-muted fw-medium small">Founded in India</span>
                  </div>
                  <div className="mb-4">
                    <h3 className="fw-bold mb-0" style={{ color: 'var(--secondary)' }}>50K+</h3>
                    <span className="text-muted fw-medium small">Lives Impacted</span>
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0" style={{ color: 'var(--accent)' }}>100+</h3>
                    <span className="text-muted fw-medium small">Active Volunteers</span>
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

export default About;