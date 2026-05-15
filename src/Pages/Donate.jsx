import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
const API = import.meta.env.VITE_API_URL 

const Donate = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '', email: '', amount: '', method: 'Razorpay', frequency: 'One Time'
  });
  const [status, setStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, name: user.name || "", email: user.email || "" }));
    }
  }, [user]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!formData.amount || formData.amount <= 0) return alert("Please enter a valid amount");
    if (!formData.name || !formData.email) return alert("Please fill all details");

    setIsProcessing(true);
    setStatus('');

    try {
      const token = localStorage.getItem("token");
      // 1. Create order on your backend
      const orderRes = await fetch(`${API}/donations/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: formData.amount })
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setIsProcessing(false);
        return setStatus('error');
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: 'rzp_test_SjDroSRjZsY7Ln', // Frontend test key
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Hope & Help Foundation",
        description: "Charity Donation",
        image: "/vite.svg", // You can put your logo here
        order_id: orderData.id,
        handler: async function (response) {
          // 3. Verify payment on your backend
          try {
            const verifyRes = await fetch(`${API}/donations`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                ...formData,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              })
            });

            if (verifyRes.ok) {
              setStatus('success');
              setTimeout(() => window.location.href = "/donor/dashboard", 2000);
            } else {
              setStatus('error');
            }
          } catch (error) {
            setStatus('error');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: "" // Optional
        },
        theme: {
          color: "#ea580c" // Accent color
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert("Payment Failed. Reason: " + response.error.description);
      });
      rzp.open();
      
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const setAmount = (amt) => setFormData({ ...formData, amount: amt });

  return (
    <section className="donate-section d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--bg-surface) 100%)', paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-12">
            <div className="glass-card p-4 p-md-5 animate-fade-in-up shadow-lg">
              
              <div className="text-center mb-5">
                <div className="mb-3 d-inline-block p-3 rounded-circle" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent)' }}>
                  <i className="bi-heart-fill" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <h2 className="text-gradient mb-2">Make a Donation</h2>
                <p className="text-muted">Your generous contribution brings hope to those in need.</p>
              </div>

              {status === 'success' && <div className="alert alert-success text-center fw-bold">Donation Successful! Receipt sent to your email. Redirecting...</div>}
              {status === 'error' && <div className="alert alert-danger text-center fw-bold">Payment processing failed. Please check your connection or Razorpay keys.</div>}

              <form className="custom-form donate-form" onSubmit={handlePayment}>
                
                <div className="row mb-4">
                  <div className="col-md-6 mb-4 mb-md-0">
                    <h5 className="mb-3" style={{ color: 'var(--primary-dark)' }}>Donation Frequency</h5>
                    <div className="d-flex gap-4 p-3 rounded" style={{ background: 'white', border: '1px solid var(--border-color)' }}>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="frequency" id="freqOneTime" defaultChecked onChange={() => setFormData({...formData, frequency: 'One Time'})} />
                        <label className="form-check-label fw-medium" htmlFor="freqOneTime">One Time</label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="frequency" id="freqMonthly" onChange={() => setFormData({...formData, frequency: 'Monthly'})} />
                        <label className="form-check-label fw-medium" htmlFor="freqMonthly">Monthly</label>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <h5 className="mb-3" style={{ color: 'var(--primary-dark)' }}>Secure Payment via</h5>
                    <div className="d-flex gap-4 p-3 rounded align-items-center" style={{ background: 'white', border: '1px solid var(--border-color)', height: '100%' }}>
                        <span className="fw-bold text-primary"><i className="bi-shield-check me-2"></i> Razorpay Payment Gateway</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="mb-3" style={{ color: 'var(--primary-dark)' }}>Select an amount</h5>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {[500, 1000, 2500, 5000, 10000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAmount(amt)}
                        className={`btn fw-bold ${formData.amount === amt ? 'btn-primary' : 'btn-outline-primary'}`}
                        style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.5rem' }}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 fw-bold text-muted">₹</span>
                    <input
                      type="number"
                      className="form-control premium-input border-start-0 ps-0"
                      placeholder="Custom amount"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                      required
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <h5 className="mb-3" style={{ color: 'var(--primary-dark)' }}>Personal Info</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <input type="text" className="form-control premium-input" placeholder="Full Name" value={formData.name} readOnly required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <input type="email" className="form-control premium-input" placeholder="Email Address" value={formData.email} readOnly required />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-premium btn-accent w-100 py-3" style={{ fontSize: '1.1rem' }} disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Pay with Razorpay'} <i className="bi-arrow-right ms-2"></i>
                </button>
                
                <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: '0.85rem' }}>
                  <i className="bi-lock-fill me-1"></i> Secure encrypted payment by Razorpay
                </p>

              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Donate;
