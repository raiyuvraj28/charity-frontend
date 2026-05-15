import React, { useState } from "react";

const Volunteer = () => {
  const [formData, setFormData] = useState({ name: '', email: '', interest: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', interest: '', message: '' });
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
    <section className="volunteer-section section-padding" id="volunteer">
      <div className="container">
        <div className="row align-items-center">

          {/* Left Side Form */}
          <div className="col-lg-6 col-12">
            <div className="volunteer-form-container animate-fade-in-up">
              <h2 className="text-white mb-4">Join as a Volunteer 🤝</h2>

              {status === 'success' && <div className="alert alert-success">Application submitted successfully!</div>}
              {status === 'error' && <div className="alert alert-danger">Failed to submit. Is the server running?</div>}

              <form className="custom-form volunteer-form mb-0" onSubmit={handleSubmit}>
                <h3 className="mb-4">Become a volunteer today</h3>

                <div className="row">
                  <div className="col-lg-6 col-12">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="Your Name" required />
                  </div>
                  <div className="col-lg-6 col-12">
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="Your Email" required />
                  </div>
                  <div className="col-12">
                    <input type="text" name="interest" value={formData.interest} onChange={handleChange} className="form-control" placeholder="Area of Interest (Teaching, Food Drive...)" required />
                  </div>
                </div>

                <textarea name="message" value={formData.message} onChange={handleChange} rows="3" className="form-control" placeholder="Why do you want to volunteer?"></textarea>

                <button type="submit" className="btn-premium btn-primary w-100 mt-3">
                  Submit Application
                </button>
              </form>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="col-lg-6 col-12 ps-lg-5 mt-5 mt-lg-0">
            <div className="volunteer-image-wrapper animate-fade-in-up delay-200">
              <img src="images/Dheeraj.jpeg" className="volunteer-image" alt="Volunteer Dheeraj" />
              <div className="volunteer-image-overlay">
                <h4 className="text-white mb-2">Meet Our Volunteer - Dheeraj</h4>
                <p className="text-white mb-2" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  Dheeraj is a passionate volunteer who actively contributes to community welfare programs across India. From organizing food distribution drives to supporting education initiatives, his dedication reflects the true spirit of humanity and service.
                </p>
                <p className="text-white mb-0" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  Join hands with people like Dheeraj and become a part of a mission that is transforming lives every day.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Volunteer;
