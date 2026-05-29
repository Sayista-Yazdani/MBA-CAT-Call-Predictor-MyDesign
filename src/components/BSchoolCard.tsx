import { useState } from 'react';
import type { BSchoolPrediction } from '../types';

interface BSchoolCardProps {
  prediction: BSchoolPrediction;
}

export function BSchoolCard({ prediction }: BSchoolCardProps) {
  const [expanded, setExpanded] = useState(false);

  const {
    college,
    type,
    tier,
    chance,
    status,
    reasons,
    sectionalCutoffs,
    sectionalsGot,
    profileScore,
    targetPercentile,
  } = prediction;

  if (status === 'Target Mode') {
    return (
      <div className="col-md-6 col-lg-4 mb-4">
        <div className="college-card card-target shadow-sm border border-light-subtle rounded-4 h-100 p-4 transition-all">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <span className="badge bg-primary-subtle text-primary mb-2 px-3 py-1 rounded-pill small">{tier}</span>
              <h5 className="card-title fw-bold text-dark mb-0">{college}</h5>
              <small className="text-muted fw-semibold">{type}</small>
            </div>
            <div className="target-icon-box bg-warning-subtle text-warning rounded-circle p-3 d-flex align-items-center justify-content-center shadow-sm">
              <i className="fas fa-bullseye fa-lg"></i>
            </div>
          </div>

          <div className="mt-4">
            <div className="p-3 bg-white bg-opacity-75 border border-white rounded-3 text-center mb-3 shadow-sm">
              <div className="text-secondary small fw-medium text-uppercase mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                Target CAT Percentile
              </div>
              <h3 className="fw-bold text-warning mb-0" style={{ fontSize: '1.8rem', textShadow: '0 1px 1px rgba(0,0,0,0.05)' }}>
                {targetPercentile?.toFixed(2)}%
              </h3>
            </div>

            <button
              className="btn btn-sm btn-outline-secondary w-100 rounded-pill py-2 text-dark bg-white border-secondary-subtle"
              onClick={() => setExpanded(!expanded)}
            >
              <i className={`fas ${expanded ? 'fa-chevron-up' : 'fa-info-circle'} me-1 text-primary`}></i>
              {expanded ? 'Hide Evaluation' : 'Target Requirements'}
            </button>

            {expanded && (
              <div className="card-details-panel mt-3 border-top pt-3">
                <p className="text-muted small mb-2">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  Overall target calculated adjusting for profile composite score.
                </p>
                <h6 className="fw-bold text-secondary small mb-2">Sectional Minimums Required:</h6>
                <div className="d-flex justify-content-between text-secondary small bg-white p-2 rounded border border-light-subtle shadow-sm mb-3">
                  <span>VARC: <strong className="text-dark">{sectionalCutoffs.VARC}%</strong></span>
                  <span>DILR: <strong className="text-dark">{sectionalCutoffs.DILR}%</strong></span>
                  <span>QA: <strong className="text-dark">{sectionalCutoffs.QA}%</strong></span>
                </div>

                <h6 className="fw-bold text-secondary small mb-2">Detailed Advice:</h6>
                <div className="p-3 bg-white rounded-3 border border-light-subtle shadow-sm mb-3">
                  {reasons.map((r, index) => (
                    <p key={index} className="small text-muted mb-1" dangerouslySetInnerHTML={{ __html: `<i class="fas fa-info-circle me-1 text-secondary"></i>${r}` }} />
                  ))}
                </div>

                <div className="text-secondary small mt-2 fw-semibold">
                  Profile Score: <span className="badge bg-secondary-subtle text-secondary">{profileScore.toFixed(1)}/60</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  let chanceClass = 'call-low';
  let chanceText = 'Low Chance';
  let strokeColor = '#ef4444'; // red
  let cardColorClass = 'card-low-chance';

  const roundedChance = Math.round(chance || 0);

  if (roundedChance >= 75) {
    chanceClass = 'call-high';
    chanceText = 'High Chance';
    strokeColor = '#10b981';
    cardColorClass = 'card-high-chance';
  } else if (roundedChance >= 40) {
    chanceClass = 'call-medium';
    chanceText = 'Moderate Chance';
    strokeColor = '#f59e0b';
    cardColorClass = 'card-medium-chance';
  }

  const isEligible = !status.startsWith('Ineligible');
  if (!isEligible) {
    cardColorClass = 'card-ineligible';
    strokeColor = '#ef4444';
  }

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className={`college-card ${cardColorClass} shadow-sm border border-light-subtle rounded-4 h-100 p-4 transition-all`}>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <span className="badge bg-white text-dark mb-2 px-3 py-1 rounded-pill small border border-light-subtle shadow-sm">{tier}</span>
            <h5 className="card-title fw-bold text-dark mb-0">{college}</h5>
            <small className="text-muted fw-semibold">{type}</small>
          </div>

          {/* Radial SVG Gauge (Centered and Clip-free) */}
          <div className="radial-gauge-wrapper position-relative" style={{ width: '65px', height: '65px' }}>
            <svg viewBox="0 0 40 40" className="radial-chart" style={{ width: '100%', height: '100%' }}>
              <circle cx="20" cy="20" r="16" fill="transparent" stroke="rgba(15, 23, 42, 0.06)" strokeWidth="3" />
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="transparent"
                stroke={strokeColor}
                strokeWidth="3.5"
                strokeDasharray="100.53"
                strokeDashoffset={100.53 - (100.53 * (isEligible ? roundedChance : 100)) / 100}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />
            </svg>
            <div
              className="radial-gauge-text fw-bold text-dark d-flex align-items-center justify-content-center"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', fontSize: '0.95rem', fontFamily: "'Poppins', sans-serif" }}
            >
              {isEligible ? roundedChance + '%' : <i className="fas fa-times text-danger"></i>}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className={`call-chance ${chanceClass} px-3 py-1 rounded-pill small`}>
              {isEligible ? chanceText : 'Ineligible'}
            </span>
            <small className="text-secondary small fw-medium">
              Profile score: <span className="badge bg-light text-dark border border-light-subtle">{profileScore.toFixed(1)}/60</span>
            </small>
          </div>

          <button
            className="btn btn-sm btn-outline-secondary w-100 rounded-pill py-2 text-dark bg-white border-secondary-subtle"
            onClick={() => setExpanded(!expanded)}
          >
            <i className={`fas ${expanded ? 'fa-chevron-up' : 'fa-info-circle'} me-1 text-primary`}></i>
            {expanded ? 'Hide Evaluation' : 'Profile Evaluation'}
          </button>

          {expanded && (
            <div className="card-details-panel mt-3 border-top pt-3">
              {/* Sectionals Checkmarks */}
              <h6 className="fw-bold text-secondary small mb-2">Sectional Cutoff Audits:</h6>
              {sectionalsGot && (
                <div className="p-3 bg-white rounded-3 mb-3 border border-light-subtle shadow-sm">
                  <div className="d-flex justify-content-between align-items-center small mb-2">
                    <span className="text-secondary">VARC (Cutoff: {sectionalCutoffs.VARC}%)</span>
                    <span className="fw-semibold text-dark">
                      <strong>{sectionalsGot.VARC}%</strong>
                      {sectionalsGot.VARC >= sectionalCutoffs.VARC ? (
                        <i className="fas fa-check-circle text-success ms-1"></i>
                      ) : (
                        <i className="fas fa-times-circle text-danger ms-1"></i>
                      )}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center small mb-2">
                    <span className="text-secondary">DILR (Cutoff: {sectionalCutoffs.DILR}%)</span>
                    <span className="fw-semibold text-dark">
                      <strong>{sectionalsGot.DILR}%</strong>
                      {sectionalsGot.DILR >= sectionalCutoffs.DILR ? (
                        <i className="fas fa-check-circle text-success ms-1"></i>
                      ) : (
                        <i className="fas fa-times-circle text-danger ms-1"></i>
                      )}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center small mb-0">
                    <span className="text-secondary">QA (Cutoff: {sectionalCutoffs.QA}%)</span>
                    <span className="fw-semibold text-dark">
                      <strong>{sectionalsGot.QA}%</strong>
                      {sectionalsGot.QA >= sectionalCutoffs.QA ? (
                        <i className="fas fa-check-circle text-success ms-1"></i>
                      ) : (
                        <i className="fas fa-times-circle text-danger ms-1"></i>
                      )}
                    </span>
                  </div>
                </div>
              )}

              <h6 className="fw-bold text-secondary small mb-2">Detailed Feedback:</h6>
              <div className="p-3 bg-white rounded-3 border border-light-subtle shadow-sm">
                {reasons.map((r, index) => (
                  <p key={index} className="small text-muted mb-1" dangerouslySetInnerHTML={{ __html: `<i class="fas fa-info-circle me-1 text-secondary"></i>${r}` }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
