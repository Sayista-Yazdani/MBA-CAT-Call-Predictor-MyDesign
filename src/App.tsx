import { useState, useMemo, useEffect } from 'react';
import type { CandidateProfile } from './types';
import { usePredictor } from './hooks/usePredictor';
import { Splash } from './components/Splash';
import { Header } from './components/Header';
import { StepperForm } from './components/StepperForm';
import { BSchoolCard } from './components/BSchoolCard';
import { Consultation } from './components/Consultation';
import { WhatIfSlider } from './components/WhatIfSlider';
import { AICounsellor } from './components/AICounsellor';
import { CounsellingBanner } from './components/CounsellingBanner';
import { MentorshipModal } from './components/MentorshipModal';
import { Footer } from './components/Footer';

// Import our custom premium style sheets natively
import './styles/style.css';
import './styles/mediaquary.css';
import './styles/animation.css';
import './styles/scroll.css';

export default function App() {
  // Load candidate profile from localStorage to persist data across browser refreshes
  const [originalProfile, setOriginalProfile] = useState<CandidateProfile | null>(() => {
    try {
      const saved = localStorage.getItem('cat_predictor_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [hasCalculated, setHasCalculated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('cat_predictor_profile');
      return saved ? true : false;
    } catch {
      return false;
    }
  });

  const [adjustedPercentile, setAdjustedPercentile] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('cat_predictor_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Number(parsed.catOverall) || 95;
      }
    } catch {}
    return 95;
  });

  const [loading, setLoading] = useState(false);
  const [consultOpen, setConsultOpen] = useState(false);
  const [mentorshipOpen, setMentorshipOpen] = useState(false);

  // Sync profile data to localStorage whenever originalProfile is updated
  useEffect(() => {
    try {
      if (originalProfile) {
        localStorage.setItem('cat_predictor_profile', JSON.stringify(originalProfile));
      }
    } catch (e) {
      console.error("Failed to sync profile to localStorage", e);
    }
  }, [originalProfile]);

  // Compute a scaled profile dynamically when the user drags the What-If slider
  const computedProfile = useMemo((): CandidateProfile | null => {
    if (!originalProfile) return null;
    if (originalProfile.hasCATScore !== 'Yes') return originalProfile;

    const originalOverall = Number(originalProfile.catOverall) || 95;
    const scaleFactor = adjustedPercentile / originalOverall;

    // Scale sectionals proportionally to maintain realistic score balance
    const scaledVARC = Math.min(Math.round((Number(originalProfile.catVARC) || 95) * scaleFactor * 100) / 100, 100);
    const scaledDILR = Math.min(Math.round((Number(originalProfile.catDILR) || 95) * scaleFactor * 100) / 100, 100);
    const scaledQA = Math.min(Math.round((Number(originalProfile.catQA) || 95) * scaleFactor * 100) / 100, 100);

    return {
      ...originalProfile,
      catOverall: adjustedPercentile,
      catVARC: scaledVARC,
      catDILR: scaledDILR,
      catQA: scaledQA,
    };
  }, [originalProfile, adjustedPercentile]);

  // Reactive calculations using our core custom hook
  const predictions = usePredictor(computedProfile);

  const handlePredict = (newProfile: CandidateProfile) => {
    setLoading(true);

    // Snappy synthetic 350ms loading spinner for premium micro-interaction
    setTimeout(() => {
      setOriginalProfile(newProfile);
      setAdjustedPercentile(Number(newProfile.catOverall) || 95);
      setLoading(false);
      setHasCalculated(true);

      // Smooth scroll down to results section
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 350);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* 1. Snappy Flash Splash Screen */}
      <Splash />

      {/* 2. Brand Header (Navbar with custom SVG logos) */}
      <Header />

      {/* 3. Hero Campus Video Section */}
      <section id="hero" className="hero-section">
        <video className="hero-video" autoPlay muted loop playsInline preload="none" aria-hidden="true">
          <source src="assets/videos/iim-campus.mp4" type="video/mp4" />
        </video>
        <div className="container">
          <h1 className="hero-title">CAT CALL PREDICTOR</h1>
        </div>
      </section>

      {/* 4. Interactive Multi-Step Stepper Section */}
      <section id="predictor" className="form-section mainbg-color py-5">
        <div className="container py-5">
          <StepperForm onPredict={handlePredict} loading={loading} />
        </div>
      </section>

      {/* 5. Dynamic Call Prediction Dashboard */}
      {hasCalculated && computedProfile && (
        <section id="results" className="results-section show">
          <div className="container">
            
            {/* What-If Slider (Active mode only) */}
            {computedProfile.hasCATScore === 'Yes' && (
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <WhatIfSlider 
                    currentValue={adjustedPercentile}
                    onChange={setAdjustedPercentile}
                  />
                  
                  {/* Download PDF & Action Panel */}
                  <div className="d-flex justify-content-end mb-4 gap-3">
                    <button 
                      className="btn btn-primary rounded-pill px-4 py-2 border-0 shadow-sm"
                      style={{ background: 'linear-gradient(135deg, var(--brand-navy) 0%, #1e40af 100%)', fontWeight: 600 }}
                      onClick={handlePrint}
                    >
                      <i className="fas fa-file-pdf me-2"></i>
                      Download Profile Report (PDF)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Premium Gold Mentorship Banner */}
            <div className="row justify-content-center mt-3 print-hide">
              <div className="col-lg-10">
                <CounsellingBanner onOpenMentorship={() => setMentorshipOpen(true)} />
              </div>
            </div>

            <h2 className="text-center mb-5 fw-bold text-dark" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Your Predicted Calls
            </h2>
            
            <div id="resultsContainer" className="row">
              {predictions.length === 0 ? (
                <div className="col-12 text-center py-5">
                  <div className="alert alert-warning border-0 rounded-3 shadow-sm d-inline-block px-5 py-4">
                    <h5 className="mb-2">
                      <i className="fas fa-exclamation-triangle me-2 text-warning"></i>
                      No predicted colleges match!
                    </h5>
                    <p className="text-muted mb-0">Try adjusting your qualifications or entering realistic CAT scores.</p>
                  </div>
                </div>
              ) : (
                predictions.map((pred, i) => (
                  <BSchoolCard key={i} prediction={pred} />
                ))
              )}
            </div>

            {/* Print-Only Hidden Scorecard Layout (Exclusively active during PDF print generation) */}
            <div className="print-scorecard-layout">
              <div style={{ borderBottom: '3px solid #1e3a8a', paddingBottom: '10px', marginBottom: '20px' }}>
                <h2 style={{ color: '#1e3a8a', margin: '0 0 5px 0' }}>CAT CALL PREDICTOR</h2>
                <h4 style={{ color: '#d97706', margin: '0' }}>Candidate Admission Evaluation Scorecard</h4>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <div>
                  <p><strong>Candidate Name:</strong> {computedProfile.name}</p>
                  <p><strong>Gender:</strong> {computedProfile.gender} | <strong>Category:</strong> {computedProfile.category}</p>
                  <p><strong>PwD Status:</strong> {computedProfile.pwd}</p>
                </div>
                <div>
                  <p><strong>CAT Overall:</strong> {computedProfile.catOverall}%</p>
                  <p><strong>VARC:</strong> {computedProfile.catVARC}% | <strong>DILR:</strong> {computedProfile.catDILR}% | <strong>QA:</strong> {computedProfile.catQA}%</p>
                </div>
              </div>

              <h4 style={{ color: '#1e3a8a', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>Academic & Experience Profile</h4>
              <table className="print-table" style={{ marginBottom: '30px' }}>
                <thead>
                  <tr>
                    <th>Class 10th</th>
                    <th>Class 12th (Stream)</th>
                    <th>Graduation (Stream)</th>
                    <th>Work Experience</th>
                    <th>Professional Qual</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{computedProfile.class10Percentage}% ({computedProfile.class10Board})</td>
                    <td>{computedProfile.class12Percentage}% ({computedProfile.class12Stream})</td>
                    <td>{computedProfile.undergradPercentage}% ({computedProfile.undergradStream})</td>
                    <td>{computedProfile.workExDec} Months</td>
                    <td>{computedProfile.professionalQual}</td>
                  </tr>
                </tbody>
              </table>

              <h4 style={{ color: '#1e3a8a', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>Predicted B-School Chances</h4>
              <table className="print-table">
                <thead>
                  <tr>
                    <th>College Name</th>
                    <th>Tier</th>
                    <th>Eligibility Status</th>
                    <th>Call Probability</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((pred, idx) => (
                    <tr key={idx}>
                      <td><strong>{pred.college}</strong> ({pred.type})</td>
                      <td>{pred.tier}</td>
                      <td>{pred.status}</td>
                      <td>{pred.chance !== null ? pred.chance + '%' : 'Target Mode'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: '40px', fontSize: '9pt', color: '#64748b', textAlign: 'center' }}>
                © 2026 Sayista Yazdani. All rights reserved. Generated via CAT Call Predictor.
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 6. Dynamic AI Counsellor (Chat Agent Drawer) */}
      <AICounsellor profile={originalProfile} predictions={predictions} />

      {/* 7. Slide-Up Consultation Drawer */}
      <Consultation isOpen={consultOpen} onClose={() => setConsultOpen(false)} />

      {/* 8. Premium Mentorship Popup Modal */}
      <MentorshipModal isOpen={mentorshipOpen} onClose={() => setMentorshipOpen(false)} profile={computedProfile} />

      {/* 9. Copyright & Social Footer */}
      <Footer onOpenConsultation={() => setConsultOpen(true)} />
    </>
  );
}
