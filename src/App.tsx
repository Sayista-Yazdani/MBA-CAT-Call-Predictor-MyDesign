import { useState } from 'react';
import type { CandidateProfile } from './types';
import { usePredictor } from './hooks/usePredictor';
import { Splash } from './components/Splash';
import { Header } from './components/Header';
import { StepperForm } from './components/StepperForm';
import { BSchoolCard } from './components/BSchoolCard';
import { Consultation } from './components/Consultation';
import { Footer } from './components/Footer';

// Import our custom premium style sheets natively
import './styles/style.css';
import './styles/mediaquary.css';
import './styles/animation.css';
import './styles/scroll.css';

/**
 * Main App Orchestrator Component
 * 
 * 💡 LEARN CORRELATION (PHP DEVELOPERS):
 * In PHP, `index.php` acts as your central controller. It includes other PHP blocks 
 * (header, footer) and coordinates layout based on form actions.
 * In React, `App.tsx` acts as this controller! It coordinates states 
 * (like the selected profile, whether the consultation drawer is open, and loading)
 * and dynamically renders components on the fly!
 */
export default function App() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [consultOpen, setConsultOpen] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Core Custom Hook calculations
  const predictions = usePredictor(profile);

  const handlePredict = (newProfile: CandidateProfile) => {
    setLoading(true);

    // Snappy synthetic 350ms loading spinner for premium micro-interaction
    setTimeout(() => {
      setProfile(newProfile);
      setLoading(false);
      setHasCalculated(true);

      // Smooth scroll down to results section
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 350);
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
      {hasCalculated && (
        <section id="results" className="results-section show">
          <div className="container">
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
          </div>
        </section>
      )}

      {/* 6. Slide-Up Consultation Drawer */}
      <Consultation isOpen={consultOpen} onClose={() => setConsultOpen(false)} />

      {/* 7. Copyright & Social Footer */}
      <Footer onOpenConsultation={() => setConsultOpen(true)} />
    </>
  );
}
