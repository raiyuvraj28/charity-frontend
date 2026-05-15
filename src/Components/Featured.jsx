import React from "react";

function Featured() {
  const features = [
    { title: "Annadaan", highlight: "Program", icon: "bi-basket2-fill", color: "var(--primary)" },
    { title: "Swachh", highlight: "Bharat", icon: "bi-tree-fill", color: "var(--secondary)" },
    { title: "Make a", highlight: "Donation", icon: "bi-box2-heart", color: "var(--accent)" },
    { title: "Beti Padhao", highlight: "Initiative", icon: "bi-book-half", color: "var(--primary-dark)" }
  ];

  return (
    <section className="section-padding" style={{ background: 'var(--bg-main)', position: 'relative', marginTop: '-80px', zIndex: 10 }}>
      <div className="container">
        <div className="row g-4 justify-content-center">

          {features.map((feature, index) => (
            <div key={index} className={`col-lg-3 col-md-6 col-12 animate-fade-in-up delay-${(index + 1) * 100}`}>
              <div className="glass-card h-100 text-center p-4 text-decoration-none d-flex flex-column align-items-center justify-content-center" style={{ transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer' }}>
                <a href="/donate" className="text-decoration-none text-dark w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                  <div className="rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', background: `${feature.color}15`, color: feature.color }}>
                    <i className={`bi ${feature.icon}`} style={{ fontSize: '2.5rem' }}></i>
                  </div>
                  <h5 className="mb-0 fw-medium" style={{ fontSize: '1.1rem' }}>
                    {feature.title} <strong style={{ color: feature.color, fontWeight: '700' }}>{feature.highlight}</strong>
                  </h5>
                </a>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default Featured;