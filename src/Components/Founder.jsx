import React from "react";

function Founder() {
  return (
    <section className="founder-section section-padding">
      <div className="container">
        <div className="row align-items-center justify-content-between">

          {/* Image */}
          <div className="col-lg-5 col-md-5 col-12 mb-5 mb-md-0">
            <div className="founder-image-wrapper animate-fade-in-up">
              <img
                src="images/vishal.jpeg"
                className="founder-image"
                alt="Founder Vishal Samyal"
              />
            </div>
          </div>

          {/* Content */}
          <div className="col-lg-6 col-md-7 col-12">
            <div className="founder-content animate-fade-in-up delay-100">

              <h2 className="mb-2 text-gradient">Vishal Samyal</h2>
              <div className="badge-premium mb-4">
                Founder & Visionary Leader
              </div>

              <p>
                Vishal Samyal is the driving force behind Kind Heart Charity, 
                dedicated to transforming lives across India. With a strong 
                belief in equality and humanity, he started this initiative 
                to support underprivileged communities with basic needs 
                like food, education, and healthcare.
              </p>

              <p>
                His vision is to create a self-sustaining and empowered society 
                where every individual gets equal opportunities to grow. Through 
                his leadership, the organization has impacted thousands of lives 
                and continues to expand its reach every day.
              </p>

              {/* Social Icons */}
              <ul className="social-icon mt-3">
                

                <li className="social-icon-item">
                  <a href="https://www.facebook.com/vishal.samyalhttps://www.facebook.com/vishal.samyal.2025 " className="social-icon-link bi-facebook" target="_blank"></a>
                </li>

                <li className="social-icon-item">
                  <a href="https://www.instagram.com/__x_samyal/" className="social-icon-link bi-instagram" target="_blank"></a>
                </li>

                <li className="social-icon-item">
                  <a href="https://www.linkedin.com/in/vishal-samyal-a73522352/" className="social-icon-link bi-linkedin" target="_blank"></a>
                </li>
              </ul>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Founder;