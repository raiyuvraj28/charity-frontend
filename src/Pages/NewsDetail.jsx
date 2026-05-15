import React from "react";
import { useParams, Link } from "react-router-dom";
import newsData from "../data/newsdata";

const NewsDetail = () => {
  const { id } = useParams();

  const news = newsData.find((item) => item.id === parseInt(id));

  if (!news)
    return (
      <section className="section-padding bg-surface d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="text-center glass-card p-5" style={{ borderRadius: '24px' }}>
          <h2 className="display-5 fw-bold text-danger mb-3">Article Not Found</h2>
          <p className="text-muted mb-4 fs-5">
            The news article you are looking for does not exist or has been removed.
          </p>
          <Link to="/news" className="btn-premium btn-primary px-4 py-2">
            <i className="bi bi-arrow-left me-2"></i> Back to News
          </Link>
        </div>
      </section>
    );

  return (
    <section className="section-padding bg-surface" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container">

        {/* Back Button */}
        <div className="mb-4 animate-fade-in-up">
          <Link to="/news" className="btn btn-outline-secondary rounded-pill fw-medium px-4">
            <i className="bi bi-arrow-left me-2"></i> Back to Newsroom
          </Link>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10 col-12">
            
            <div className="glass-card overflow-hidden animate-fade-in-up delay-100 shadow-lg" style={{ borderRadius: '24px' }}>
              
              {/* Article Header */}
              <div className="p-4 p-md-5 border-bottom text-center">
                <span className="badge-premium mb-3 d-inline-block">Press Release</span>
                <h1 className="fw-bold display-5 mb-4" style={{ color: 'var(--primary-dark)' }}>{news.title}</h1>
                <div className="d-flex align-items-center justify-content-center gap-3 text-muted fw-medium">
                  <span><i className="bi bi-calendar-event me-2"></i> {news.date}</span>
                  <span>|</span>
                  <span><i className="bi bi-geo-alt me-2"></i> India</span>
                </div>
              </div>

              {/* Image */}
              <div className="position-relative">
                <img
                  src={news.image ||  "images/education.jpg"}
                  alt={news.title}
                  className="img-fluid w-100"
                  style={{ maxHeight: "500px", objectFit: "cover" }}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1000&auto=format&fit=crop'; }}
                />
              </div>
        
              {/* Content */}
              <div className="p-4 p-md-5 bg-white">
                <div className="fs-5 text-secondary" style={{ lineHeight: "1.9" }}>
                  <p className="lead fw-medium text-dark mb-4">
                    {news.description}
                  </p>

                  <p>
                    This development highlights ongoing efforts to improve public services
                    and infrastructure across India. Authorities have emphasized the
                    importance of community participation and transparency in implementing
                    such initiatives. By empowering local leaders and volunteers, the impact
                    of these programs is multiplied significantly.
                  </p>

                  <blockquote className="border-start border-4 border-primary ps-4 my-5 fst-italic fw-medium text-dark" style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '0 12px 12px 0' }}>
                    "Our goal is to ensure that every corner of the country benefits from these
                    initiatives. The true strength of India lies in the resilience of its rural
                    and urban communities working together."
                  </blockquote>

                  <p>
                    Experts believe that such initiatives can significantly contribute to
                    economic growth and social welfare, particularly in rural and
                    semi-urban regions. More updates are expected in the coming weeks as 
                    additional funding and volunteer efforts are mobilized to support the cause.
                  </p>
                </div>

                {/* Share/Action Footer */}
                <div className="mt-5 pt-4 border-top d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                  <div className="d-flex gap-2">
                    <span className="fw-bold me-2">Share:</span>
                    <button className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '36px', height: '36px' }}><i className="bi bi-twitter"></i></button>
                    <button className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '36px', height: '36px' }}><i className="bi bi-facebook"></i></button>
                    <button className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '36px', height: '36px' }}><i className="bi bi-linkedin"></i></button>
                  </div>
                  <Link to="/donate" className="btn-premium btn-accent px-4 py-2">
                    Support This Cause <i className="bi bi-heart-fill ms-2"></i>
                  </Link>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default NewsDetail;