import React from "react";
import { Link } from "react-router-dom";
import newsData from "../data/newsdata";

const NewsListing = () => {
  return (
    <section className="section-padding bg-surface" style={{ minHeight: '100vh', paddingTop: '100px' }}>
      <div className="container">
        
        {/* 🔙 Back to Home Button */}
        <div className="mb-4 animate-fade-in-up">
          <Link to="/" className="btn btn-outline-secondary rounded-pill fw-medium px-4">
            <i className="bi bi-arrow-left me-2"></i> Back to Home
          </Link>
        </div>

        {/* Heading Section */}
        <div className="text-center mb-5 animate-fade-in-up delay-100">
          <span className="badge-premium mb-3 d-inline-block">Newsroom</span>
          <h2 className="display-5 fw-bold mb-3">Latest News & Updates 📰</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>
            Stay informed with the latest developments across India — government initiatives, social impact stories, and community updates.
          </p>
        </div>

        {/* News Cards */}
        <div className="row g-4">
          {newsData.map((news, index) => (
            <div className={`col-lg-4 col-md-6 col-12 animate-fade-in-up delay-${(index % 3 + 1) * 100}`} key={news.id}>
              <div className="glass-card h-100 overflow-hidden d-flex flex-column" style={{ borderRadius: '24px' }}>

                {/* Image */}
                <div className="position-relative overflow-hidden" style={{ height: "220px" }}>
                  <img
                    src={news.image || "/images/education.jpeg"} 
                    className="w-100 h-100"
                    alt={news.title}
                    style={{ objectFit: "cover", transition: "transform 0.5s" }}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800&auto=format&fit=crop'; }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <div className="position-absolute top-0 start-0 m-3">
                    <span className="badge bg-white text-primary px-3 py-2 shadow-sm rounded-pill fw-bold">
                      {news.date}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <h5 className="fw-bold mb-3" style={{ lineHeight: '1.4' }}>{news.title}</h5>
                  <p className="text-muted mb-4 flex-grow-1" style={{ fontSize: "0.95rem" }}>
                    {news.description?.slice(0, 100)}...
                  </p>

                  {/* Button */}
                  <Link
                    to={`/news/${news.id}`}
                    className="btn btn-outline-dark w-100 rounded-pill py-2 fw-semibold"
                    style={{ transition: 'all 0.3s' }}
                    onMouseOver={e => {e.target.style.backgroundColor = 'var(--primary)'; e.target.style.borderColor = 'var(--primary)'; e.target.style.color = 'white'}}
                    onMouseOut={e => {e.target.style.backgroundColor = 'transparent'; e.target.style.borderColor = '#212529'; e.target.style.color = '#212529'}}
                  >
                    Read Full Article <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsListing;