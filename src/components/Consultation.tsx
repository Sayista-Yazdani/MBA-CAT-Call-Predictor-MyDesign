import React, { useState } from 'react';

interface ConsultationProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Consultation Component
 * 
 * 💡 LEARN CORRELATION (PHP DEVELOPERS):
 * React uses local dynamic states (`formData`, `submitted`) to instantly capture 
 * user inputs, validate inputs on the fly, and render success alerts 
 * without reloading the webpage!
 */
export function Consultation({ isOpen, onClose }: ConsultationProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState('');
  const [questions, setQuestions] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Perform basic form validation
    if (!firstName || !lastName || !email || !phone || !source) {
      alert("Please fill in all required fields marked with *");
      return;
    }

    // Capture dynamic lead to Google Sheet (Syncing with Mentorship Webhook)
    try {
      const webhookUrl = "https://script.google.com/macros/s/AKfycbxk6TGM2j1MgB6cOc4ANHgi7CPUTA6D223x6s-x8g_hzHqM1qmOKUIW-fiO-QBn-VZQEA/exec";
      const payload = {
        timestamp: new Date().toISOString(),
        firstName,
        lastName,
        email,
        phone,
        source,
        questions: questions || "Free Consultation Request"
      };

      await Promise.race([
        fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }),
        new Promise(resolve => setTimeout(resolve, 800)) // Snappy fallback
      ]);
    } catch (err) {
      console.warn("Consultation lead logging skipped", err);
    }

    // Success response
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      // Clear form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setSource('');
      setQuestions('');
      onClose();
    }, 2000);
  };

  return (
    <section id="consultation" className={isOpen ? 'active' : ''}>
      <div className="consultation-sticky" role="region" aria-label="Free Consultation Form">
        <div className="icon-wrapper" aria-hidden="true">
          <div className="icon-img">
            <img src="assets/images/customer-service.gif" alt="Free MBA consultation phone icon" />
          </div>
        </div>

        {/* Close Button */}
        <button 
          type="button" 
          className="btn-close close-form rounded-0 p-1 text-center text-muted text-white"
          onClick={onClose}
          aria-label="Close form"
        />

        <div className="consult-text">Free Consultation</div>

        {success ? (
          <div className="alert alert-success border-0 rounded-3 shadow-sm py-3 text-center my-3">
            <i className="fas fa-check-circle me-2 text-success"></i>
            <strong className="d-block small">Request Submitted!</strong>
            <span style={{ fontSize: '0.75rem' }} className="text-secondary">We will contact you shortly.</span>
          </div>
        ) : (
          <form id="consultForm" onSubmit={handleSubmit} noValidate>
            <div className="row mb-2">
              <div className="col-6">
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  placeholder="First Name*" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required 
                />
              </div>
              <div className="col-6">
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  placeholder="Last Name*" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required 
                />
              </div>
            </div>
            <div className="mb-2">
              <input 
                type="email" 
                className="form-control form-control-sm" 
                placeholder="Email*" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="mb-2">
              <input 
                type="tel" 
                className="form-control form-control-sm" 
                placeholder="Phone*" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required 
              />
            </div>
            <div className="mb-2">
              <select 
                className="form-select form-select-sm" 
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
              >
                <option value="" disabled>How did you hear about us? *</option>
                <option value="friend">Friend</option>
                <option value="advertisement">Advertisement</option>
                <option value="online">Online</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-2">
              <textarea 
                className="form-control form-control-sm" 
                rows={3}
                placeholder="Additional Questions?"
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-submit">Submit</button>
          </form>
        )}
      </div>
    </section>
  );
}
