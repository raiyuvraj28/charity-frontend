import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <section className="contact-section section-padding" id="contact">
      <div className="container">
        <div className="row">

          {/* LEFT SIDE */}
          <div className="col-lg-4 col-12 mb-5 mb-lg-0">
            <div className="contact-info-wrap animate-fade-in-up">
              <h2>Get in Touch 🇮🇳</h2>

              <div className="contact-image-wrap d-flex flex-wrap">
                <img
                  src="images/yuvraj.jpeg"
                  className="img-fluid avatar-image"
                  alt="Yuvraj"
                />

                <div className="d-flex flex-column justify-content-center ms-4">
                  <p className="mb-0" style={{ fontSize: '1.2rem', fontWeight: '600' }}>Yuvraj</p>
                  <p className="mb-0 text-white-50" style={{ fontSize: '0.9rem' }}>
                    Volunteer Coordinator
                  </p>
                </div>
              </div>

              <div className="contact-info">
                <h5 className="mb-3">Contact Information</h5>

                <p className="d-flex mb-2">
                  <i className="bi-geo-alt me-2"></i>
                  Gurdaspur, Punjab, India
                </p>

                <p className="d-flex mb-2">
                  <i className="bi-telephone me-2"></i>
                  <a href="tel:+919876543210">+91  9465877520</a>
                </p>

                <p className="d-flex">
                  <i className="bi-envelope me-2"></i>
                  <a href="mailto:info@charity.org">
                    yuvrajrai508@gmail.com
                  </a>
                </p>

                <a href="#" className="btn-premium btn-secondary mt-4 w-100 border-0" style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: 'var(--primary)' }}>
                  Get Directions
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (FORM) */}
          <div className="col-lg-7 col-12 ms-auto">
            <div className="contact-form-container animate-fade-in-up delay-200">
              {status === 'success' && <div className="alert alert-success">Message sent successfully!</div>}
              {status === 'error' && <div className="alert alert-danger">Failed to send message. Is the server running?</div>}
              
              <form className="custom-form contact-form mb-0" onSubmit={handleSubmit}>
                <h2 className="mb-2">Send us a message</h2>

              <p className="mb-4">
                Or, you can directly email us:
                <a href="mailto:yuvrajrai508@gmail.com">
                  {" "}yuvrajrai508@gmail.com
                </a>
              </p>

              <div className="row">
                <div className="col-lg-6 col-md-6 col-12">
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="form-control" placeholder="First Name" required />
                </div>
                <div className="col-lg-6 col-md-6 col-12">
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="form-control" placeholder="Last Name" required />
                </div>
              </div>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="Your Email" required />
              <textarea name="message" value={formData.message} onChange={handleChange} rows="5" className="form-control" placeholder="How can we help you?" required></textarea>

              <button type="submit" className="btn-premium btn-primary w-100 mt-2">
                Send Message
              </button>
            </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
