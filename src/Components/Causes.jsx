import React from "react";

const Causes = () => {
  const causesData = [
    {
      title: "Education in Rural Bihar",
      desc: "We support underprivileged children across rural Bihar by providing free education, school supplies, and digital learning opportunities.",
      img: "images/child.jpg",
      fallback: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop",
      raised: "15,00,000",
      goal: "20,00,000",
      progress: 75,
      color: "var(--primary)"
    },
    {
      title: "Flood Relief in Assam",
      desc: "We organize rescue operations, राशन वितरण (ration distribution), and medical camps to support flood-affected families in Assam.",
      img: "images/poverty.jpg",
      fallback: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
      raised: "8,00,000",
      goal: "16,00,000",
      progress: 50,
      color: "var(--secondary)"
    },
    {
      title: "Clean Water in Rajasthan",
      desc: "We provide clean and safe drinking water in remote villages of Rajasthan by installing hand pumps and modern water filters.",
      img: "images/water.jpeg",
      fallback: "https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=800&auto=format&fit=crop",
      raised: "25,00,000",
      goal: "28,00,000",
      progress: 90,
      color: "var(--accent)"
    }
  ];

  return (
    <section className="section-padding bg-surface" id="causes">
      <div className="container">
        <div className="row mb-5 text-center">
          <div className="col-12 animate-fade-in-up">
            <span className="badge-premium mb-3 d-inline-block">Urgent Causes</span>
            <h2 className="display-5 fw-bold mb-3 text-gradient">Our Causes 🇮🇳</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>Join hands with us to support these urgent campaigns and make a meaningful impact in society.</p>
          </div>
        </div>

        <div className="row g-4">
          {causesData.map((cause, idx) => (
            <div key={idx} className={`col-lg-4 col-md-6 col-12 animate-fade-in-up delay-${(idx + 1) * 100}`}>
              <div className="glass-card h-100 overflow-hidden d-flex flex-column shadow-lg" style={{ borderRadius: '24px', border: '1px solid rgba(255,255,255,0.4)', transition: 'transform 0.3s, box-shadow 0.3s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div className="position-relative overflow-hidden" style={{ height: '240px' }}>
                  <img
                    src={cause.img}
                    alt={cause.title}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover', transition: 'transform 0.5s' }}
                    onError={(e) => { e.target.src = cause.fallback; }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <div className="position-absolute top-0 end-0 m-3">
                    <span className="badge bg-white text-dark px-3 py-2 shadow-sm rounded-pill fw-bold">
                      <i className="bi bi-heart-fill me-1" style={{color: cause.color}}></i> Donate
                    </span>
                  </div>
                </div>

                <div className="p-4 d-flex flex-column flex-grow-1">
                  <h5 className="fw-bold mb-3">{cause.title}</h5>
                  <p className="text-muted mb-4 flex-grow-1" style={{ fontSize: '0.95rem' }}>{cause.desc}</p>

                  <div className="progress-wrapper mb-4 p-3 rounded-4" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-bold fs-5" style={{ color: cause.color }}>{cause.progress}% <span className="fs-6 text-muted fw-normal">Funded</span></span>
                      <span className="text-muted fw-bold d-flex align-items-center"><i className="bi bi-bullseye me-1"></i> Goal: ₹{cause.goal}</span>
                    </div>
                    <div className="progress mb-2" style={{ height: '10px', borderRadius: '5px', backgroundColor: 'rgba(0,0,0,0.08)' }}>
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        style={{ width: `${cause.progress}%`, backgroundColor: cause.color, borderRadius: '5px' }}
                        aria-valuenow={cause.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                    <div className="mt-2 text-start">
                      <small className="fw-bold text-dark fs-6"><i className="bi bi-graph-up-arrow me-1 text-success"></i> Raised: ₹{cause.raised}</small>
                    </div>
                  </div>

                  <a href="/donate" className="btn text-white w-100 py-3 fw-bold rounded-pill" style={{ backgroundColor: cause.color, transition: 'all 0.3s', boxShadow: `0 4px 15px ${cause.color}40`, fontSize: '1.05rem' }}
                     onMouseOver={e => {e.target.style.transform = 'scale(1.02)'; e.target.style.boxShadow = `0 6px 20px ${cause.color}60`}}
                     onMouseOut={e => {e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = `0 4px 15px ${cause.color}40`}}
                  >
                    Donate Now <i className="bi bi-arrow-right-circle-fill ms-2"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Causes;