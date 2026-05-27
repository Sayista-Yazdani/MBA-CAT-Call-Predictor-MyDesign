interface WhatIfSliderProps {
  currentValue: number;
  onChange: (value: number) => void;
}

export function WhatIfSlider({ currentValue, onChange }: WhatIfSliderProps) {
  return (
    <div className="what-if-slider-container mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold text-dark mb-0" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <i className="fas fa-sliders-h text-primary me-2"></i>
          What-If Percentile Analyzer
        </h5>
        <span className="badge bg-primary text-white px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '1rem' }}>
          Active: {currentValue.toFixed(2)}%
        </span>
      </div>
      <p className="text-secondary small mb-4">
        Slide to dynamically adjust your CAT overall score. Your sectional marks will scale proportionally, and B-school call probabilities will update in real-time without form resubmission!
      </p>
      
      <div className="row align-items-center g-3">
        <div className="col-2 text-start fw-bold text-secondary small">80.00%</div>
        <div className="col-8">
          <input 
            type="range" 
            className="slider-range-control"
            min="80.00" 
            max="100.00" 
            step="0.05"
            value={currentValue}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        </div>
        <div className="col-2 text-end fw-bold text-secondary small">100.00%</div>
      </div>
    </div>
  );
}
