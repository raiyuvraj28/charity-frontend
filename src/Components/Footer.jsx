import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="text-white pt-5 pb-3" style={{ background: 'var(--text-main)' }}>
      <div className="container pt-4">
        <div className="row gy-5">

          {/* Logo & About */}
          <div className="col-lg-4 col-md-6 mb-4 pe-lg-5">
            <Link className="d-flex align-items-center gap-2 mb-4 text-decoration-none" to="/">
              <div style={{
                background: 'var(--primary)',
                color: 'white',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}>H&H</div>
              <div>
                <h4 className="mb-0 fw-bold text-white">Hope & Help</h4>
                <small className="d-block" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: '-2px' }}>Foundation</small>
              </div>
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
              We are a non-profit organization dedicated to bringing hope to those who need it most. Join us in making a real difference.
            </p>
            <a href="#donate" className="btn btn-primary btn-premium mt-3 border-0 px-4 py-2" style={{ borderRadius: 'var(--radius-full)' }}>
              Donate Now
            </a>
          </div>

          {/* Quick Links */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="mb-4 fw-bold" style={{ color: 'var(--primary-light)' }}>Quick Links</h5>
            <ul className="list-unstyled" style={{ gap: '10px', display: 'flex', flexDirection: 'column' }}>
              <li><a href="#about" className="text-decoration-none" style={{ color: 'rgba(255,255,255,0.8)', transition: 'color 0.2s' }}>Our Story</a></li>
              <li><a href="#news" className="text-decoration-none" style={{ color: 'rgba(255,255,255,0.8)', transition: 'color 0.2s' }}>Newsroom</a></li>
              <li><a href="#causes" className="text-decoration-none" style={{ color: 'rgba(255,255,255,0.8)', transition: 'color 0.2s' }}>Causes</a></li>
              <li><a href="#volunteer" className="text-decoration-none" style={{ color: 'rgba(255,255,255,0.8)', transition: 'color 0.2s' }}>Become a volunteer</a></li>
              <li><a href="#partner" className="text-decoration-none" style={{ color: 'rgba(255,255,255,0.8)', transition: 'color 0.2s' }}>Partner with us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-5 col-md-12 mb-4">
            <h5 className="mb-4 fw-bold" style={{ color: 'var(--primary-light)' }}>Contact Information</h5>
            
            <div className="d-flex align-items-center mb-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', color: 'var(--primary-light)' }}>
                <i className="bi bi-telephone-fill"></i>
              </div>
              <a href="tel:9465877520" className="text-decoration-none" style={{ color: 'rgba(255,255,255,0.8)' }}>9465877520</a>
            </div>

            <div className="d-flex align-items-center mb-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', color: 'var(--primary-light)' }}>
                <i className="bi bi-envelope-fill"></i>
              </div>
              <a href="mailto:yuvrajrai508@gmail.com" className="text-decoration-none" style={{ color: 'rgba(255,255,255,0.8)' }}>yuvrajrai508@gmail.com</a>
            </div>

            <div className="d-flex align-items-center mb-4">
              <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', color: 'var(--primary-light)' }}>
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>Gurdaspur, Punjab, India</span>
            </div>

            <a href="https://maps.google.com" className="btn btn-outline-light px-4" style={{ borderRadius: 'var(--radius-full)' }} target="_blank" rel="noreferrer">
              Get Direction <i className="bi bi-arrow-right ms-2"></i>
            </a>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="row mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              &copy; {new Date().getFullYear()} <span className="fw-semibold text-white">Hope & Help Foundation</span>. All rights reserved.
              <br />
              Crafted with <i className="bi bi-heart-fill text-danger mx-1"></i> by <a href="#" className="text-white text-decoration-none fw-semibold">Yuvraj Rai</a>
            </p>
          </div>
          
          <div className="col-md-6 d-flex justify-content-center justify-content-md-end align-items-center">
            <div className="d-flex gap-3">
              <a href="https://x.com/raiyuvraj28" className="text-white" target="_blank" rel="noreferrer"><i className="bi bi-twitter fs-5"></i></a>
              <a href="https://www.facebook.com/yuvraj.rai.142654" className="text-white" target="_blank" rel="noreferrer"><i className="bi bi-facebook fs-5"></i></a>
              <a href="https://www.instagram.com/rai_yuvraj_/" className="text-white" target="_blank" rel="noreferrer"><i className="bi bi-instagram fs-5"></i></a>
              <a href="https://www.linkedin.com/in/yuvraj-rai-7492b5370/" className="text-white" target="_blank" rel="noreferrer"><i className="bi bi-linkedin fs-5"></i></a>
              <a href="https://www.youtube.com/channel/UCCOYadw6r3zO-8Asj642mQQ" className="text-white" target="_blank" rel="noreferrer"><i className="bi bi-youtube fs-5"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;