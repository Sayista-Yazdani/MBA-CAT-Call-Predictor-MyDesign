import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CandidateProfile } from '../types';

interface StepperFormProps {
  onPredict: (profile: CandidateProfile) => void;
  loading: boolean;
}

const initialProfileState: CandidateProfile = {
  name: '',
  gender: '',
  category: '',
  pwd: 'No',
  class10Board: '',
  class10Percentage: 0,
  class12Board: '',
  class12Percentage: 0,
  class12Stream: '',
  undergradPercentage: 0,
  undergradStream: '',
  class12MathMarks: undefined,
  class12BestFour: undefined,
  workExDec: 0,
  workExJuly: 0,
  workExJan: 0,
  workExRelevance: 0,
  profileStrength: 0,
  professionalQual: 'No',
  postGrad: 'No',
  nirfRank: undefined,
  agriBioDegree: 'No',
  ioeInstitute: 'No',
  iimMumbaiOSCM: 'No',
  vgsomQualify: 'No',
  dfsdbeDegree: 'No',
  hasCATScore: 'Yes',
  catOverall: undefined,
  catVARC: undefined,
  catDILR: undefined,
  catQA: undefined,
};

export function StepperForm({ onPredict, loading }: StepperFormProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<CandidateProfile>(initialProfileState);

  // Slide Animation configurations
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const [direction, setDirection] = useState(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value === '' ? undefined : Number(value)
    }));
  };

  const validateCurrentStep = (): boolean => {
    // Basic HTML5 validation simulation
    const currentStepEl = document.getElementById(`step-${step}`);
    if (!currentStepEl) return true;

    const requiredInputs = currentStepEl.querySelectorAll("[required]") as NodeListOf<HTMLInputElement | HTMLSelectElement>;
    let isValid = true;

    requiredInputs.forEach(input => {
      if (!input.checkValidity() || input.value.trim() === "") {
        input.classList.add("is-invalid");
        isValid = false;
      } else {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
      }
    });

    if (!isValid) {
      const firstInvalid = currentStepEl.querySelector(":invalid") as HTMLElement;
      if (firstInvalid) firstInvalid.focus();
    }

    return isValid;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setDirection(1);
    setStep(prev => Math.min(prev + 1, 4));
    
    // Smooth scroll predictor section into view
    document.getElementById("predictor")?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrev = () => {
    setDirection(-1);
    setStep(prev => Math.max(prev - 1, 1));
    document.getElementById("predictor")?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;
    onPredict(profile);
  };

  return (
    <div className="form-container">
      {/* Stepper Progress Bar */}
      <div className="step-progress-wrapper mb-5">
        <div className="step-progress-bar-container">
          <div className="step-progress-bar" id="stepProgressBar" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>
        <div className="step-indicators">
          <div className={`step-indicator-item ${step >= 1 ? 'active' : ''}`}>
            <div className="step-icon"><i className="fas fa-user"></i></div>
            <span className="step-label">Profile</span>
          </div>
          <div className={`step-indicator-item ${step >= 2 ? 'active' : ''}`}>
            <div className="step-icon"><i className="fas fa-graduation-cap"></i></div>
            <span className="step-label">Academics</span>
          </div>
          <div className={`step-indicator-item ${step >= 3 ? 'active' : ''}`}>
            <div className="step-icon"><i className="fas fa-briefcase"></i></div>
            <span className="step-label">Experience</span>
          </div>
          <div className={`step-indicator-item ${step >= 4 ? 'active' : ''}`}>
            <div className="step-icon"><i className="fas fa-chart-pie"></i></div>
            <span className="step-label">CAT Score</span>
          </div>
        </div>
      </div>

      <form id="predictorForm" onSubmit={handleSubmit} noValidate>
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="step-1"
              id="step-1"
              className="form-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h4 className="step-title mb-4"><i className="fas fa-user-circle me-2 text-primary"></i>Personal Profile</h4>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label">Full Name<span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="fas fa-user"></i></span>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name" 
                      required 
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Gender<span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="fas fa-venus-mars"></i></span>
                    <select 
                      className="form-select" 
                      name="gender" 
                      value={profile.gender}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select your gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Category<span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="fas fa-users"></i></span>
                    <select 
                      className="form-select" 
                      name="category" 
                      value={profile.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select your category</option>
                      <option value="General">General</option>
                      <option value="EWS">EWS</option>
                      <option value="OBC-NCL">OBC-NCL</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Are you a Person with Disability (PwD)?</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="fas fa-wheelchair"></i></span>
                    <select 
                      className="form-select" 
                      name="pwd"
                      value={profile.pwd}
                      onChange={handleInputChange}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end mt-5">
                <button type="button" className="btn btn-next" onClick={handleNext}>
                  Next Step <i className="fas fa-arrow-right ms-2"></i>
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              id="step-2"
              className="form-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h4 className="step-title mb-4"><i className="fas fa-graduation-cap me-2 text-primary"></i>Academic Records</h4>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label">Class 10th Board<span className="text-danger">*</span></label>
                  <select 
                    className="form-select" 
                    name="class10Board" 
                    value={profile.class10Board}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select your 10th board</option>
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State Board">State Board</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Class 10th percentage (out of 100)<span className="text-danger">*</span></label>
                  <div className="input-group">
                    <input 
                      type="number" 
                      className="form-control" 
                      name="class10Percentage"
                      value={profile.class10Percentage ?? ''}
                      onChange={handleNumericChange}
                      placeholder="e.g. 85.50" 
                      step="0.01" 
                      min="0" 
                      max="100" 
                      required 
                    />
                    <span className="input-group-text">%</span>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Class 12th Board<span className="text-danger">*</span></label>
                  <select 
                    className="form-select" 
                    name="class12Board" 
                    value={profile.class12Board}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select your 12th board</option>
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State Board">State Board</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Class 12th percentage (out of 100)<span className="text-danger">*</span></label>
                  <div className="input-group">
                    <input 
                      type="number" 
                      className="form-control" 
                      name="class12Percentage"
                      value={profile.class12Percentage ?? ''}
                      onChange={handleNumericChange}
                      placeholder="e.g. 85.50" 
                      step="0.01" 
                      min="0" 
                      max="100" 
                      required 
                    />
                    <span className="input-group-text">%</span>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Class 12th stream<span className="text-danger">*</span></label>
                  <select 
                    className="form-select" 
                    name="class12Stream" 
                    value={profile.class12Stream}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select your stream</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Undergrad percentage (out of 100)<span className="text-danger">*</span></label>
                  <div className="input-group">
                    <input 
                      type="number" 
                      className="form-control" 
                      name="undergradPercentage"
                      value={profile.undergradPercentage ?? ''}
                      onChange={handleNumericChange}
                      placeholder="e.g. 78.50" 
                      step="0.01" 
                      min="0" 
                      max="100" 
                      required 
                    />
                    <span className="input-group-text">%</span>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Undergrad stream<span className="text-danger">*</span></label>
                  <select 
                    className="form-select" 
                    name="undergradStream" 
                    value={profile.undergradStream}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select your stream</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Class XII Math/Business Math Marks (out of 100)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="class12MathMarks"
                    value={profile.class12MathMarks ?? ''}
                    onChange={handleNumericChange}
                    placeholder="e.g. 72.5" 
                    step="0.01" 
                    min="0" 
                    max="100" 
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Percentage in Class XII (Best of Four Subjects)</label>
                  <div className="input-group">
                    <input 
                      type="number" 
                      className="form-control" 
                      name="class12BestFour"
                      value={profile.class12BestFour ?? ''}
                      onChange={handleNumericChange}
                      placeholder="e.g. 88.75" 
                      step="0.01" 
                      min="0" 
                      max="100" 
                    />
                    <span className="input-group-text">%</span>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between mt-5">
                <button type="button" className="btn btn-prev" onClick={handlePrev}>
                  <i className="fas fa-arrow-left me-2"></i> Previous
                </button>
                <button type="button" className="btn btn-next" onClick={handleNext}>
                  Next Step <i className="fas fa-arrow-right ms-2"></i>
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              id="step-3"
              className="form-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h4 className="step-title mb-4"><i className="fas fa-briefcase me-2 text-primary"></i>Work Ex & Extra Profile Details</h4>
              <div className="row g-4">
                <div className="col-md-4">
                  <label className="form-label">Work Ex (Months) as on July 30, 2025<span className="text-danger">*</span></label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="workExJuly" 
                    value={profile.workExJuly ?? ''}
                    onChange={handleNumericChange}
                    placeholder="0" 
                    min="0" 
                    step="0.1" 
                    required 
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Work Ex (Months) as on Dec 31, 2025<span className="text-danger">*</span></label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="workExDec" 
                    value={profile.workExDec ?? ''}
                    onChange={handleNumericChange}
                    placeholder="0" 
                    min="0" 
                    step="0.1" 
                    required 
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Work Ex (Months) as on Jan 31, 2026<span className="text-danger">*</span></label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="workExJan" 
                    value={profile.workExJan ?? ''}
                    onChange={handleNumericChange}
                    placeholder="0" 
                    min="0" 
                    step="0.1" 
                    required 
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Work-Ex Relevance (0 to 5)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="workExRelevance" 
                    value={profile.workExRelevance ?? ''}
                    onChange={handleNumericChange}
                    placeholder="Rate 0-5" 
                    min="0" 
                    max="5" 
                    step="0.5" 
                  />
                  <small className="text-muted">(0 = Low/Irrelevant, 5 = Highly Relevant Technical/Management)</small>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Co-curricular/Profile Strength (0 to 5)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="profileStrength" 
                    value={profile.profileStrength ?? ''}
                    onChange={handleNumericChange}
                    placeholder="Rate 0-5" 
                    min="0" 
                    max="5" 
                    step="0.5" 
                  />
                  <small className="text-muted">(Rate achievements in sports, debating, leadership, etc.)</small>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Professional Qualification (CA, CFA, CMA, CS)</label>
                  <select 
                    className="form-select" 
                    name="professionalQual"
                    value={profile.professionalQual}
                    onChange={handleInputChange}
                  >
                    <option value="No">No</option>
                    <option value="CA">CA</option>
                    <option value="CFA">CFA</option>
                    <option value="CMA">CMA</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Have you done Post Graduation?</label>
                  <select 
                    className="form-select" 
                    name="postGrad"
                    value={profile.postGrad}
                    onChange={handleInputChange}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">NIRF Rank of UG Institute</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="nirfRank" 
                    value={profile.nirfRank ?? ''}
                    onChange={handleNumericChange}
                    placeholder="e.g. 15" 
                    min="1" 
                  />
                  <small className="text-muted">(Leave blank if not ranked or unknown)</small>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Agri/Bio Degree for IIM Lucknow ABM?</label>
                  <select 
                    className="form-select" 
                    name="agriBioDegree"
                    value={profile.agriBioDegree}
                    onChange={handleInputChange}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">UG from IoE / CFTI / Institute of National Importance?</label>
                  <select 
                    className="form-select" 
                    name="ioeInstitute"
                    value={profile.ioeInstitute}
                    onChange={handleInputChange}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Qualifies for IIM Mumbai OSCM (STEM background)?</label>
                  <select 
                    className="form-select" 
                    name="iimMumbaiOSCM"
                    value={profile.iimMumbaiOSCM}
                    onChange={handleInputChange}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">UG Background qualifying for VGSoM IIT KGP MBA?</label>
                  <select 
                    className="form-select" 
                    name="vgsomQualify"
                    value={profile.vgsomQualify}
                    onChange={handleInputChange}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Undergraduate degree in DFS/DBE preferred disciplines?</label>
                  <select 
                    className="form-select" 
                    name="dfsdbeDegree"
                    value={profile.dfsdbeDegree}
                    onChange={handleInputChange}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-between mt-5">
                <button type="button" className="btn btn-prev" onClick={handlePrev}>
                  <i className="fas fa-arrow-left me-2"></i> Previous
                </button>
                <button type="button" className="btn btn-next" onClick={handleNext}>
                  Next Step <i className="fas fa-arrow-right ms-2"></i>
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step-4"
              id="step-4"
              className="form-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h4 className="step-title mb-4"><i className="fas fa-chart-pie me-2 text-primary"></i>CAT 2025 Performance</h4>
              <div className="row g-4">
                <div className="col-md-12">
                  <label className="form-label">Do you already have your CAT Percentiles?<span className="text-danger">*</span></label>
                  <select 
                    className="form-select" 
                    name="hasCATScore" 
                    value={profile.hasCATScore}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Yes">Yes, I have my percentiles</option>
                    <option value="No">No, show general cutoffs</option>
                  </select>
                </div>

                {profile.hasCATScore === 'Yes' && (
                  <div className="col-md-12" id="catScoreFields">
                    <div className="card p-4 border border-light-subtle rounded-3 bg-light-subtle mb-4">
                      <h6 className="mb-3 text-secondary"><i className="fas fa-keyboard me-2"></i>Enter Percentiles (0 to 100)</h6>
                      <div className="row g-4">
                        <div className="col-md-3">
                          <label className="form-label">Overall Percentile</label>
                          <input 
                            type="number" 
                            className="form-control" 
                            name="catOverall"
                            value={profile.catOverall ?? ''}
                            onChange={handleNumericChange}
                            placeholder="e.g. 99.50" 
                            step="0.01" 
                            min="0" 
                            max="100"
                            required
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">VARC Percentile</label>
                          <input 
                            type="number" 
                            className="form-control" 
                            name="catVARC"
                            value={profile.catVARC ?? ''}
                            onChange={handleNumericChange}
                            placeholder="e.g. 98.50" 
                            step="0.01" 
                            min="0" 
                            max="100"
                            required
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">DILR Percentile</label>
                          <input 
                            type="number" 
                            className="form-control" 
                            name="catDILR"
                            value={profile.catDILR ?? ''}
                            onChange={handleNumericChange}
                            placeholder="e.g. 97.50" 
                            step="0.01" 
                            min="0" 
                            max="100"
                            required
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">QA Percentile</label>
                          <input 
                            type="number" 
                            className="form-control" 
                            name="catQA"
                            value={profile.catQA ?? ''}
                            onChange={handleNumericChange}
                            placeholder="e.g. 99.00" 
                            step="0.01" 
                            min="0" 
                            max="100"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-between align-items-center mt-5">
                <button type="button" className="btn btn-prev" onClick={handlePrev}>
                  <i className="fas fa-arrow-left me-2"></i> Previous
                </button>
                <div className="position-relative">
                  <button 
                    type="submit" 
                    className="btn-predict px-5 py-3 rounded-pill text-white border-0 shadow"
                    disabled={loading}
                  >
                    <i className="fas fa-chart-line me-2"></i> Predict My Calls
                  </button>
                  {loading && <div className="spinner" id="loadingSpinner" style={{ display: 'block' }}></div>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
