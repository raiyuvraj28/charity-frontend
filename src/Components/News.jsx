import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import { Link } from "react-router-dom";

const STATIC_NEWS = [
  { _id: "1", id: 1, title: "India Expands Free Education Programs", date: "April 2, 2026", imageUrl: "images/news/education.jpg", description: "Government and NGOs across India are expanding free education initiatives to support children in rural and underprivileged communities with digital learning tools." },
  { _id: "2", id: 2, title: "Digital India Growth in Rural Areas",   date: "April 1, 2026", imageUrl: "images/news/digital2.jpg",  description: "The Digital India mission is transforming villages with better internet access, online education, and job opportunities for youth." },
  { _id: "3", id: 3, title: "Nationwide Food Distribution Drive",    date: "March 30, 2026", imageUrl: "images/news/distribute copy.jpg", description: "NGOs and volunteers organized large-scale food drives across multiple states, helping thousands of families with essential ration supplies." },
];

const News = () => {
  const [newsData, setNewsData] = useState(STATIC_NEWS);

  useEffect(() => {
    fetch(`${API_BASE_URL}/news`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data) && data.length > 0) setNewsData(data); })
      .catch(() => {}); // silently fall back to static
  }, []);

  return (
    <section className="section-padding" id="news" style={{ backgroundColor: "var(--bg-main)" }}>
      <div className="container">
        <div className="text-center mb-5 animate-fade-in-up">
          <span className="badge-premium mb-3 d-inline-block">In The Press</span>
          <h2 className="display-5 fw-bold mb-3 text-gradient">Latest News 🇮🇳</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "600px", fontSize: "1.1rem" }}>
            Catch up on the latest developments and social impact stories happening across the nation.
          </p>
        </div>

        <div className="row g-4">
          {newsData.slice(0, 3).map((news, index) => (
            <div className={`col-lg-4 col-md-6 col-12 animate-fade-in-up delay-${(index + 1) * 100}`} key={news._id || news.id}>
              <div className="glass-card h-100 overflow-hidden d-flex flex-column shadow-sm"
                style={{ borderRadius: "24px", transition: "transform 0.3s, box-shadow 0.3s" }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.1)"; }}
                onMouseOut={e  => { e.currentTarget.style.transform = "translateY(0)";     e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.05)"; }}>

                <div className="position-relative overflow-hidden" style={{ height: "220px" }}>
                  <img
                    src={news.imageUrl || news.image}
                    className="w-100 h-100"
                    alt={news.title}
                    style={{ objectFit: "cover", transition: "transform 0.5s" }}
                    onError={e => { e.target.src = "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800&auto=format&fit=crop"; }}
                    onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseOut={e  => e.currentTarget.style.transform = "scale(1)"}
                  />
                  <div className="position-absolute top-0 start-0 m-3">
                    <span className="badge bg-white text-primary px-3 py-2 shadow-sm rounded-pill fw-bold">
                      {news.date}
                    </span>
                  </div>
                </div>

                <div className="p-4 d-flex flex-column flex-grow-1">
                  <h5 className="fw-bold mb-3" style={{ lineHeight: "1.4" }}>{news.title}</h5>
                  <p className="text-muted mb-4 flex-grow-1" style={{ fontSize: "0.95rem" }}>
                    {news.description?.length > 120 ? news.description.slice(0, 120) + "..." : news.description}
                  </p>
                  <Link
                    to={`/news/${news.id || news._id}`}
                    className="btn btn-outline-dark w-100 rounded-pill py-2 fw-semibold mt-auto"
                    style={{ transition: "all 0.3s" }}
                    onMouseOver={e => { e.target.style.backgroundColor = "var(--primary)"; e.target.style.borderColor = "var(--primary)"; e.target.style.color = "white"; }}
                    onMouseOut={e  => { e.target.style.backgroundColor = "transparent";    e.target.style.borderColor = "#212529";          e.target.style.color = "#212529"; }}
                  >
                    Read More <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <Link to="/news" className="btn-premium btn-secondary px-4 py-2">
            View All News <i className="bi bi-collection ms-2"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default News;
