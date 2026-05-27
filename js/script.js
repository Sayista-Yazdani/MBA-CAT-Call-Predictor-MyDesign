const splash = document.getElementById("splash-screen");

// Hide splash screen extremely fast on DOMContentLoaded so it feels snappy!
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        if (splash) {
            splash.classList.add("hide-splash");
            setTimeout(() => {
                splash.style.display = "none";
            }, 300); // fade duration
        }
    }, 450); // fast 450ms visual flash
});

// Multi-step Form Navigation & Validation
document.addEventListener("DOMContentLoaded", () => {
    const steps = document.querySelectorAll(".form-step");
    const indicators = document.querySelectorAll(".step-indicator-item");
    const progressBar = document.getElementById("stepProgressBar");

    window.changeStep = (currentStep, direction) => {
        // Validation check before proceeding to next step
        if (direction === 1) {
            const currentStepEl = document.getElementById(`step-${currentStep}`);
            const inputs = currentStepEl.querySelectorAll("[required]");
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.checkValidity() || input.value.trim() === "") {
                    input.classList.add("is-invalid");
                    isValid = false;
                } else {
                    input.classList.remove("is-invalid");
                    input.classList.add("is-valid");
                }
            });
            
            if (!isValid) {
                const firstInvalid = currentStepEl.querySelector(":invalid");
                if (firstInvalid) firstInvalid.focus();
                return;
            }
        }

        const nextStep = currentStep + direction;
        if (nextStep < 1 || nextStep > 4) return;

        // Hide current step, show next
        steps.forEach(step => {
            step.classList.remove("active-step");
            step.classList.add("hidden-step");
        });
        
        const nextStepEl = document.getElementById(`step-${nextStep}`);
        nextStepEl.classList.add("active-step");
        nextStepEl.classList.remove("hidden-step");

        // Update progress indicators
        indicators.forEach((indicator, index) => {
            if (index + 1 <= nextStep) {
                indicator.classList.add("active");
            } else {
                indicator.classList.remove("active");
            }
        });

        // Update Progress Bar width
        progressBar.style.width = `${(nextStep / 4) * 100}%`;
        
        // Scroll form section gently into view
        document.getElementById("predictor").scrollIntoView({ behavior: 'smooth' });
    };

    // Attach step navigation handlers dynamically to the buttons
    document.querySelectorAll(".btn-next").forEach(btn => {
        btn.addEventListener("click", () => {
            const currentStep = parseInt(btn.closest(".form-step").id.replace("step-", ""));
            changeStep(currentStep, 1);
        });
    });

    document.querySelectorAll(".btn-prev").forEach(btn => {
        btn.addEventListener("click", () => {
            const currentStep = parseInt(btn.closest(".form-step").id.replace("step-", ""));
            changeStep(currentStep, -1);
        });
    });
});

// Show/Hide CAT Score Fields
document.getElementById('hasCATScore').addEventListener('change', function () {
    const catFields = document.getElementById('catScoreFields');
    const inputFields = catFields.querySelectorAll('input');
    if (this.value === 'Yes') {
        catFields.style.display = 'block';
        inputFields.forEach(input => input.setAttribute('required', 'required'));
    } else {
        catFields.style.display = 'none';
        inputFields.forEach(input => input.removeAttribute('required'));
    }
});

// Predictor Form Submission
document.getElementById('predictorForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Final Validation of active step (Step 4)
    const activeStep = document.querySelector(".form-step.active-step");
    const requiredInputs = activeStep.querySelectorAll("[required]");
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
        const firstInvalid = activeStep.querySelector(":invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
    }

    // Show loading spinner
    document.getElementById('loadingSpinner').style.display = 'block';
    document.querySelector('.btn-predict').disabled = true;

    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // Short delay for satisfying spinner feedback before displaying instant results
    setTimeout(() => {
        const predictions = calculatePredictions(data);
        displayResults(predictions);

        // Hide spinner
        document.getElementById('loadingSpinner').style.display = 'none';
        document.querySelector('.btn-predict').disabled = false;

        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    }, 350);
});

// Accurate IIM Cutoffs & Data Models
const collegeDatabase = [
    {
        name: "IIM Ahmedabad (PGP)",
        overallCutoff: { General: 99.0, EWS: 95.0, "OBC-NCL": 95.0, SC: 85.0, ST: 80.0, PwD: 80.0 },
        sectionalCutoffs: {
            General: { VARC: 70, DILR: 70, QA: 70 },
            EWS: { VARC: 65, DILR: 65, QA: 65 },
            "OBC-NCL": { VARC: 65, DILR: 65, QA: 65 },
            SC: { VARC: 60, DILR: 60, QA: 60 },
            ST: { VARC: 50, DILR: 50, QA: 50 },
            PwD: { VARC: 50, DILR: 50, QA: 50 }
        },
        type: "IIM",
        tier: "Tier 1 (Elite)"
    },
    {
        name: "IIM Bangalore (PGP)",
        overallCutoff: { General: 98.5, EWS: 93.0, "OBC-NCL": 93.0, SC: 85.0, ST: 80.0, PwD: 80.0 },
        sectionalCutoffs: {
            General: { VARC: 80, DILR: 75, QA: 75 },
            EWS: { VARC: 72, DILR: 65, QA: 65 },
            "OBC-NCL": { VARC: 72, DILR: 65, QA: 65 },
            SC: { VARC: 65, DILR: 55, QA: 55 },
            ST: { VARC: 55, DILR: 50, QA: 50 },
            PwD: { VARC: 50, DILR: 50, QA: 50 }
        },
        type: "IIM",
        tier: "Tier 1 (Elite)"
    },
    {
        name: "IIM Calcutta (PGP)",
        overallCutoff: { General: 99.3, EWS: 95.0, "OBC-NCL": 95.0, SC: 85.0, ST: 80.0, PwD: 80.0 },
        sectionalCutoffs: {
            General: { VARC: 80, DILR: 80, QA: 80 },
            EWS: { VARC: 75, DILR: 75, QA: 75 },
            "OBC-NCL": { VARC: 75, DILR: 75, QA: 75 },
            SC: { VARC: 65, DILR: 65, QA: 65 },
            ST: { VARC: 55, DILR: 55, QA: 55 },
            PwD: { VARC: 55, DILR: 55, QA: 55 }
        },
        type: "IIM",
        tier: "Tier 1 (Elite)"
    },
    {
        name: "IIM Lucknow (PGP)",
        overallCutoff: { General: 99.0, EWS: 94.0, "OBC-NCL": 94.0, SC: 85.0, ST: 80.0, PwD: 80.0 },
        sectionalCutoffs: {
            General: { VARC: 85, DILR: 85, QA: 85 },
            EWS: { VARC: 77, DILR: 77, QA: 77 },
            "OBC-NCL": { VARC: 77, DILR: 77, QA: 77 },
            SC: { VARC: 55, DILR: 55, QA: 55 },
            ST: { VARC: 50, DILR: 50, QA: 50 },
            PwD: { VARC: 50, DILR: 50, QA: 50 }
        },
        type: "IIM",
        tier: "Tier 1 (Elite)"
    },
    {
        name: "IIM Lucknow (ABM)",
        overallCutoff: { General: 95.0, EWS: 90.0, "OBC-NCL": 90.0, SC: 80.0, ST: 75.0, PwD: 75.0 },
        sectionalCutoffs: {
            General: { VARC: 75, DILR: 75, QA: 75 },
            EWS: { VARC: 70, DILR: 70, QA: 70 },
            "OBC-NCL": { VARC: 70, DILR: 70, QA: 70 },
            SC: { VARC: 50, DILR: 50, QA: 50 },
            ST: { VARC: 45, DILR: 45, QA: 45 },
            PwD: { VARC: 45, DILR: 45, QA: 45 }
        },
        type: "IIM - Specialized",
        tier: "Tier 1",
        reqAgriBio: true
    },
    {
        name: "IIM Kozhikode (PGP)",
        overallCutoff: { General: 98.0, EWS: 90.0, "OBC-NCL": 90.0, SC: 80.0, ST: 75.0, PwD: 75.0 },
        sectionalCutoffs: {
            General: { VARC: 75, DILR: 75, QA: 75 },
            EWS: { VARC: 65, DILR: 65, QA: 65 },
            "OBC-NCL": { VARC: 65, DILR: 65, QA: 65 },
            SC: { VARC: 55, DILR: 55, QA: 55 },
            ST: { VARC: 45, DILR: 45, QA: 45 },
            PwD: { VARC: 45, DILR: 45, QA: 45 }
        },
        type: "IIM",
        tier: "Tier 1"
    },
    {
        name: "IIM Indore (PGP)",
        overallCutoff: { General: 97.0, EWS: 90.0, "OBC-NCL": 90.0, SC: 80.0, ST: 75.0, PwD: 75.0 },
        sectionalCutoffs: {
            General: { VARC: 80, DILR: 80, QA: 80 },
            EWS: { VARC: 70, DILR: 70, QA: 70 },
            "OBC-NCL": { VARC: 70, DILR: 70, QA: 70 },
            SC: { VARC: 55, DILR: 55, QA: 55 },
            ST: { VARC: 45, DILR: 45, QA: 45 },
            PwD: { VARC: 45, DILR: 45, QA: 45 }
        },
        type: "IIM",
        tier: "Tier 1",
        heavyAcads: true
    },
    {
        name: "IIM Mumbai (MBA)",
        overallCutoff: { General: 97.5, EWS: 90.0, "OBC-NCL": 90.0, SC: 82.0, ST: 77.0, PwD: 77.0 },
        sectionalCutoffs: {
            General: { VARC: 75, DILR: 75, QA: 75 },
            EWS: { VARC: 65, DILR: 65, QA: 65 },
            "OBC-NCL": { VARC: 65, DILR: 65, QA: 65 },
            SC: { VARC: 50, DILR: 50, QA: 50 },
            ST: { VARC: 45, DILR: 45, QA: 45 },
            PwD: { VARC: 45, DILR: 45, QA: 45 }
        },
        type: "IIM",
        tier: "Tier 1"
    },
    {
        name: "IIM Mumbai (OSCM)",
        overallCutoff: { General: 97.0, EWS: 90.0, "OBC-NCL": 90.0, SC: 80.0, ST: 75.0, PwD: 75.0 },
        sectionalCutoffs: {
            General: { VARC: 75, DILR: 75, QA: 75 },
            EWS: { VARC: 65, DILR: 65, QA: 65 },
            "OBC-NCL": { VARC: 65, DILR: 65, QA: 65 },
            SC: { VARC: 50, DILR: 50, QA: 50 },
            ST: { VARC: 45, DILR: 45, QA: 45 },
            PwD: { VARC: 45, DILR: 45, QA: 45 }
        },
        type: "IIM - Specialized",
        tier: "Tier 1",
        reqOSCM: true
    },
    {
        name: "VGSoM IIT Kharagpur",
        overallCutoff: { General: 96.0, EWS: 90.0, "OBC-NCL": 90.0, SC: 80.0, ST: 75.0, PwD: 75.0 },
        sectionalCutoffs: {
            General: { VARC: 75, DILR: 75, QA: 75 },
            EWS: { VARC: 65, DILR: 65, QA: 65 },
            "OBC-NCL": { VARC: 65, DILR: 65, QA: 65 },
            SC: { VARC: 50, DILR: 50, QA: 50 },
            ST: { VARC: 45, DILR: 45, QA: 45 },
            PwD: { VARC: 45, DILR: 45, QA: 45 }
        },
        type: "Non-IIM (Elite)",
        tier: "Tier 1",
        reqVgsom: true
    },
    {
        name: "DFS (Delhi University)",
        overallCutoff: { General: 96.5, EWS: 93.0, "OBC-NCL": 93.0, SC: 83.0, ST: 78.0, PwD: 78.0 },
        sectionalCutoffs: {
            General: { VARC: 70, DILR: 70, QA: 70 },
            EWS: { VARC: 60, DILR: 60, QA: 60 },
            "OBC-NCL": { VARC: 60, DILR: 60, QA: 60 },
            SC: { VARC: 50, DILR: 50, QA: 50 },
            ST: { VARC: 45, DILR: 45, QA: 45 },
            PwD: { VARC: 45, DILR: 45, QA: 45 }
        },
        type: "Non-IIM (Elite)",
        tier: "Tier 2",
        reqDfs: true
    },
    {
        name: "IIM Udaipur (CAP)",
        overallCutoff: { General: 92.0, EWS: 77.0, "OBC-NCL": 74.0, SC: 54.0, ST: 40.0, PwD: 40.0 },
        sectionalCutoffs: {
            General: { VARC: 70, DILR: 70, QA: 70 },
            EWS: { VARC: 50, DILR: 50, QA: 50 },
            "OBC-NCL": { VARC: 50, DILR: 50, QA: 50 },
            SC: { VARC: 35, DILR: 35, QA: 35 },
            ST: { VARC: 27, DILR: 27, QA: 27 },
            PwD: { VARC: 27, DILR: 27, QA: 27 }
        },
        type: "IIM - CAP",
        tier: "Tier 2"
    },
    {
        name: "IIM Trichy (CAP)",
        overallCutoff: { General: 92.0, EWS: 77.0, "OBC-NCL": 74.0, SC: 54.0, ST: 40.0, PwD: 40.0 },
        sectionalCutoffs: {
            General: { VARC: 70, DILR: 70, QA: 70 },
            EWS: { VARC: 50, DILR: 50, QA: 50 },
            "OBC-NCL": { VARC: 50, DILR: 50, QA: 50 },
            SC: { VARC: 35, DILR: 35, QA: 35 },
            ST: { VARC: 27, DILR: 27, QA: 27 },
            PwD: { VARC: 27, DILR: 27, QA: 27 }
        },
        type: "IIM - CAP",
        tier: "Tier 2"
    },
    {
        name: "IIM Ranchi (CAP)",
        overallCutoff: { General: 92.0, EWS: 77.0, "OBC-NCL": 74.0, SC: 54.0, ST: 40.0, PwD: 40.0 },
        sectionalCutoffs: {
            General: { VARC: 70, DILR: 70, QA: 70 },
            EWS: { VARC: 50, DILR: 50, QA: 50 },
            "OBC-NCL": { VARC: 50, DILR: 50, QA: 50 },
            SC: { VARC: 35, DILR: 35, QA: 35 },
            ST: { VARC: 27, DILR: 27, QA: 27 },
            PwD: { VARC: 27, DILR: 27, QA: 27 }
        },
        type: "IIM - CAP",
        tier: "Tier 2"
    },
    {
        name: "IIM Raipur (CAP)",
        overallCutoff: { General: 92.0, EWS: 77.0, "OBC-NCL": 74.0, SC: 54.0, ST: 40.0, PwD: 40.0 },
        sectionalCutoffs: {
            General: { VARC: 70, DILR: 70, QA: 70 },
            EWS: { VARC: 50, DILR: 50, QA: 50 },
            "OBC-NCL": { VARC: 50, DILR: 50, QA: 50 },
            SC: { VARC: 35, DILR: 35, QA: 35 },
            ST: { VARC: 27, DILR: 27, QA: 27 },
            PwD: { VARC: 27, DILR: 27, QA: 27 }
        },
        type: "IIM - CAP",
        tier: "Tier 2"
    },
    {
        name: "IIM Kashipur (CAP)",
        overallCutoff: { General: 92.0, EWS: 77.0, "OBC-NCL": 74.0, SC: 54.0, ST: 40.0, PwD: 40.0 },
        sectionalCutoffs: {
            General: { VARC: 70, DILR: 70, QA: 70 },
            EWS: { VARC: 50, DILR: 50, QA: 50 },
            "OBC-NCL": { VARC: 50, DILR: 50, QA: 50 },
            SC: { VARC: 35, DILR: 35, QA: 35 },
            ST: { VARC: 27, DILR: 27, QA: 27 },
            PwD: { VARC: 27, DILR: 27, QA: 27 }
        },
        type: "IIM - CAP",
        tier: "Tier 2"
    }
];

// Precision Prediction Algorithm
function calculatePredictions(data) {
    const predictions = [];

    // Parse numeric values
    const hasCAT = data.hasCATScore === 'Yes';
    const catOverall = parseFloat(data.catOverall) || 0;
    const catVARC = parseFloat(data.catVARC) || 0;
    const catDILR = parseFloat(data.catDILR) || 0;
    const catQA = parseFloat(data.catQA) || 0;

    const class10 = parseFloat(data.class10Percentage) || 0;
    const class12 = parseFloat(data.class12Percentage) || 0;
    const undergrad = parseFloat(data.undergradPercentage) || 0;

    // Use December 31st as primary standard work experience month
    const workExDec = parseFloat(data.workExDec) || 0;
    const workExRelevance = parseFloat(data.workExRelevance) || 0;
    const profileStrength = parseFloat(data.profileStrength) || 0;

    // Map Category (Handles PwD bypass automatically)
    let category = data.category || 'General';
    if (data.pwd === 'Yes') {
        category = 'PwD';
    }

    // 1. Calculate Profile Scores
    // Academic points (Max 30) - Authentic slabs instead of average
    let p10 = 1;
    if (class10 >= 90) p10 = 10;
    else if (class10 >= 80) p10 = 8;
    else if (class10 >= 70) p10 = 5;
    else if (class10 >= 60) p10 = 3;

    let p12 = 1;
    if (class12 >= 90) p12 = 10;
    else if (class12 >= 80) p12 = 8;
    else if (class12 >= 70) p12 = 5;
    else if (class12 >= 60) p12 = 3;

    let pug = 1;
    if (undergrad >= 85) pug = 10;
    else if (undergrad >= 75) pug = 8;
    else if (undergrad >= 65) pug = 5;
    else if (undergrad >= 55) pug = 3;

    const acadScore = p10 + p12 + pug;

    // Work Experience Points (Max 10) - Bell-curve
    let workExPoints = 0;
    if (workExDec >= 22 && workExDec <= 36) {
        workExPoints = 10;
    } else if (workExDec >= 12 && workExDec < 22) {
        workExPoints = (workExDec - 12) * 1.0;
    } else if (workExDec > 36 && workExDec <= 48) {
        workExPoints = 10 - (workExDec - 36) * 0.8;
    } else if (workExDec > 48) {
        workExPoints = 3;
    } else {
        workExPoints = 0;
    }
    
    // Scale by relevance factor
    const relScore = parseFloat(workExRelevance) || 0;
    const workExMultiplier = 0.6 + (relScore / 5) * 0.4;
    workExPoints = Math.min(workExPoints * workExMultiplier, 10);
    workExPoints = Math.round(workExPoints * 10) / 10;

    // Diversity Scores (Max 10)
    const genderDiv = (data.gender === 'Female' || data.gender === 'Other') ? 5 : 0;
    const acadDiv = (data.undergradStream !== 'Engineering') ? 5 : 0;
    const diversityPoints = genderDiv + acadDiv;

    // Professional qualification & PG bonuses (Max 10)
    const professionalBonus = (data.professionalQual && data.professionalQual !== 'No') ? 3 : 0;
    const pgBonus = (data.postGrad === 'Yes') ? 2 : 0;
    const ioeBonus = (data.ioeInstitute === 'Yes') ? 2 : 0;
    const extraScore = parseFloat(profileStrength) || 0;
    const extraProfilePoints = professionalBonus + pgBonus + ioeBonus + (extraScore * 0.6); // max 10

    const totalProfileScore = acadScore + workExPoints + diversityPoints + extraProfilePoints; // max 60

    collegeDatabase.forEach(college => {
        // Apply Specialized Eligibility Filters strictly
        if (college.reqAgriBio && data.agriBioDegree !== 'Yes') return;
        if (college.reqOSCM && data.iimMumbaiOSCM !== 'Yes') return;
        if (college.reqVgsom && data.vgsomQualify !== 'Yes') return;
        if (college.reqDfs && data.dfsdbeDegree !== 'Yes') return;

        const collegeOverallCutoff = college.overallCutoff[category] || college.overallCutoff['General'];
        const secCut = college.sectionalCutoffs[category] || college.sectionalCutoffs['General'];

        let status = 'Eligible';
        let chance = 0;
        let reasons = [];

        if (hasCAT) {
            // Cutoff validation checks
            const metOverall = catOverall >= collegeOverallCutoff;
            const metVARC = catVARC >= secCut.VARC;
            const metDILR = catDILR >= secCut.DILR;
            const metQA = catQA >= secCut.QA;

            if (!metOverall) {
                status = 'Ineligible (Overall Cutoff)';
                reasons.push(`Overall percentile (${catOverall.toFixed(2)}) is below the standard minimum threshold of ${collegeOverallCutoff.toFixed(2)}% for your category.`);
            }

            const missedSections = [];
            if (!metVARC) missedSections.push(`VARC (Cutoff: ${secCut.VARC}%, Got: ${catVARC}%)`);
            if (!metDILR) missedSections.push(`DILR (Cutoff: ${secCut.DILR}%, Got: ${catDILR}%)`);
            if (!metQA) missedSections.push(`QA (Cutoff: ${secCut.QA}%, Got: ${catQA}%)`);

            if (missedSections.length > 0) {
                status = status === 'Eligible' ? 'Ineligible (Sectional Cutoff)' : status;
                reasons.push(`One or more sectional cutoffs missed: ${missedSections.join(', ')}.`);
            }

            // Standard basic academic minimum constraint
            if (class10 < 60 || class12 < 60) {
                status = status === 'Eligible' ? 'Ineligible (Academic Minimum)' : status;
                reasons.push('Minimum score of 60% in Class 10th and 12th is strictly required by top IIMs.');
            }

            // Call Probability calculation
            if (status === 'Eligible') {
                let baseChance = 50;

                // Margins add positive call factors
                const margin = catOverall - collegeOverallCutoff;
                baseChance += margin * 14; // 1% above cutoff boosts by ~14%

                // Profile compensation factor (relative to standard profile baseline of 25)
                const profileDiff = totalProfileScore - 25;
                baseChance += profileDiff * 1.8;

                // College specific heavy scoring tweaks
                if (college.heavyAcads) {
                    const acadDiff = acadScore - 22;
                    baseChance += acadDiff * 4;
                }

                // Cap between 10% and 99%
                chance = Math.min(Math.max(baseChance, 10), 99);
            } else {
                // If ineligible but marginally close (within 2 percentile buffer, no sectional misses)
                if (catOverall >= collegeOverallCutoff - 2.5 && missedSections.length === 0) {
                    chance = 12;
                } else {
                    chance = 5;
                }
            }

            predictions.push({
                college: college.name,
                type: college.type,
                tier: college.tier,
                chance: Math.round(chance),
                status: status,
                reasons: reasons,
                overallCutoff: collegeOverallCutoff,
                sectionalCutoffs: secCut,
                sectionalsGot: { VARC: catVARC, DILR: catDILR, QA: catQA },
                profileScore: totalProfileScore,
                targetPercentile: null
            });
        } else {
            // TARGET MODE: Calculate target CAT percentile required based on Profile score
            let baseTarget = collegeOverallCutoff;

            // Strong profile lowers the bar slightly due to higher composite score
            const profileDiff = totalProfileScore - 25;
            baseTarget -= profileDiff * 0.16;

            // Enforce realistic bounds
            if (category === 'General') {
                baseTarget = Math.max(baseTarget, 95.0);
            } else if (category === 'OBC-NCL' || category === 'EWS') {
                baseTarget = Math.max(baseTarget, 85.0);
            } else {
                baseTarget = Math.max(baseTarget, 75.0);
            }

            predictions.push({
                college: college.name,
                type: college.type,
                tier: college.tier,
                chance: null,
                status: 'Target Mode',
                reasons: [
                    `You need to secure approximately ${baseTarget.toFixed(2)} percentile overall in CAT to clear composite score thresholds.`,
                    `Minimum sectionals required: VARC: ${secCut.VARC}%, DILR: ${secCut.DILR}%, QA: ${secCut.QA}%.`
                ],
                overallCutoff: collegeOverallCutoff,
                sectionalCutoffs: secCut,
                sectionalsGot: null,
                profileScore: totalProfileScore,
                targetPercentile: parseFloat(baseTarget.toFixed(2))
            });
        }
    });

    // Sort predictions: Active mode by chance descending, Target mode by difficulty ascending (easiest targets first)
    if (hasCAT) {
        predictions.sort((a, b) => b.chance - a.chance);
    } else {
        predictions.sort((a, b) => a.targetPercentile - b.targetPercentile);
    }

    return predictions;
}

// Display Predictor Results Dashboard
function displayResults(predictions) {
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsSection = document.getElementById('results');

    resultsContainer.innerHTML = '';

    if (predictions.length === 0) {
        resultsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-warning border-0 rounded-3 shadow-sm d-inline-block px-5 py-4">
                    <h5 class="mb-2"><i class="fas fa-exclamation-triangle me-2 text-warning"></i>No predicted colleges match!</h5>
                    <p class="text-muted mb-0">Try adjusting your qualifications or entering realistic CAT scores.</p>
                </div>
            </div>
        `;
    } else {
        predictions.forEach((pred, i) => {
            let cardHTML = '';
            
            if (pred.status === 'Target Mode') {
                // RENDER: Target Mode Cards (E.g. no CAT score entered yet)
                cardHTML = `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="college-card card-target shadow-sm border border-light-subtle rounded-4 h-100 p-4 transition-all">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <span class="badge bg-primary-subtle text-primary mb-2 px-3 py-1 rounded-pill small">${pred.tier}</span>
                                    <h5 class="card-title fw-bold text-dark mb-0">${pred.college}</h5>
                                    <small class="text-muted fw-semibold">${pred.type}</small>
                                </div>
                                <div class="target-icon-box bg-warning-subtle text-warning rounded-circle p-3 d-flex align-items-center justify-content-center shadow-sm">
                                    <i class="fas fa-bullseye fa-lg"></i>
                                </div>
                            </div>
                            
                            <div class="mt-4">
                                <div class="p-3 bg-white bg-opacity-75 border border-white rounded-3 text-center mb-3 shadow-sm">
                                    <div class="text-secondary small fw-medium text-uppercase mb-1" style="font-size: 0.75rem; letter-spacing: 0.5px;">Target CAT Percentile</div>
                                    <h3 class="fw-bold text-warning mb-0" style="font-size: 1.8rem; text-shadow: 0 1px 1px rgba(0,0,0,0.05);">${pred.targetPercentile.toFixed(2)}</h3>
                                </div>
                                
                                <button class="btn btn-sm btn-outline-secondary w-100 rounded-pill py-2 text-dark bg-white border-secondary-subtle" onclick="toggleDetails(this)">
                                    <i class="fas fa-info-circle me-1 text-primary"></i> Target Requirements
                                </button>
                                
                                <div class="card-details-panel d-none mt-3 border-top pt-3">
                                    <p class="text-muted small mb-2"><i class="fas fa-check-circle text-success me-2"></i>Overall target calculated adjusting for profile composite score.</p>
                                    <h6 class="fw-bold text-secondary small mb-2">Sectional Minimums Required:</h6>
                                    <div class="d-flex justify-content-between text-secondary small bg-white p-2 rounded border border-light-subtle shadow-sm">
                                        <span>VARC: <strong class="text-dark">${pred.sectionalCutoffs.VARC}%</strong></span>
                                        <span>DILR: <strong class="text-dark">${pred.sectionalCutoffs.DILR}%</strong></span>
                                        <span>QA: <strong class="text-dark">${pred.sectionalCutoffs.QA}%</strong></span>
                                    </div>
                                    <div class="text-secondary small mt-3 fw-semibold">Profile Score: <span class="badge bg-secondary-subtle text-secondary">${pred.profileScore}/60</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                // RENDER: Active Mode Cards (CAT score entered, show probabilities)
                let chanceClass = 'call-low';
                let chanceText = 'Low Chance';
                let strokeColor = '#ef4444'; // red
                let cardColorClass = 'card-low-chance';

                if (pred.chance >= 75) {
                    chanceClass = 'call-high';
                    chanceText = 'High Chance';
                    strokeColor = '#10b981'; // green
                    cardColorClass = 'card-high-chance';
                } else if (pred.chance >= 40) {
                    chanceClass = 'call-medium';
                    chanceText = 'Moderate Chance';
                    strokeColor = '#f59e0b'; // orange
                    cardColorClass = 'card-medium-chance';
                }
                
                const isEligible = !pred.status.startsWith('Ineligible');
                if (!isEligible) {
                    cardColorClass = 'card-ineligible';
                    strokeColor = '#ef4444'; // solid red for ineligible ring
                }

                cardHTML = `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="college-card ${cardColorClass} shadow-sm border border-light-subtle rounded-4 h-100 p-4 transition-all">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <span class="badge bg-white text-dark mb-2 px-3 py-1 rounded-pill small border border-light-subtle shadow-sm">${pred.tier}</span>
                                    <h5 class="card-title fw-bold text-dark mb-0">${pred.college}</h5>
                                    <small class="text-muted fw-semibold">${pred.type}</small>
                                </div>
                                
                                <!-- Radial SVG Gauge (Centered and Clip-free) -->
                                <div class="radial-gauge-wrapper position-relative" style="width: 65px; height: 65px;">
                                    <svg viewBox="0 0 40 40" class="radial-chart" style="width: 100%; height: 100%;">
                                        <circle cx="20" cy="20" r="16" fill="transparent" stroke="rgba(15, 23, 42, 0.06)" stroke-width="3" />
                                        <circle cx="20" cy="20" r="16" fill="transparent" stroke="${strokeColor}" stroke-width="3.5" 
                                                stroke-dasharray="100.53" stroke-dashoffset="${100.53 - (100.53 * (isEligible ? pred.chance : 100)) / 100}"
                                                stroke-linecap="round" style="transform: rotate(-90deg); transform-origin: 50% 50%;" />
                                    </svg>
                                    <div class="radial-gauge-text fw-bold text-dark d-flex align-items-center justify-content-center" 
                                         style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; font-size: 0.95rem; font-family: 'Poppins', sans-serif;">
                                        ${isEligible ? pred.chance + '%' : '<i class="fas fa-times text-danger"></i>'}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-4">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <span class="call-chance ${chanceClass} px-3 py-1 rounded-pill small">${isEligible ? chanceText : 'Ineligible'}</span>
                                    <small class="text-secondary small fw-medium">Profile score: <span class="badge bg-light text-dark border border-light-subtle">${pred.profileScore}/60</span></small>
                                </div>
                                
                                <button class="btn btn-sm btn-outline-secondary w-100 rounded-pill py-2 text-dark bg-white border-secondary-subtle" onclick="toggleDetails(this)">
                                    <i class="fas fa-info-circle me-1 text-primary"></i> Profile Evaluation
                                </button>
                                
                                <div class="card-details-panel d-none mt-3 border-top pt-3">
                                    <!-- Sectionals Checkmarks -->
                                    <h6 class="fw-bold text-secondary small mb-2">Sectional Cutoff Audits:</h6>
                                    <div class="p-3 bg-white rounded-3 mb-3 border border-light-subtle shadow-sm">
                                        <div class="d-flex justify-content-between align-items-center small mb-2">
                                            <span class="text-secondary">VARC (Cutoff: ${pred.sectionalCutoffs.VARC}%)</span>
                                            <span class="fw-semibold text-dark"><strong>${pred.sectionalsGot.VARC}%</strong> ${pred.sectionalsGot.VARC >= pred.sectionalCutoffs.VARC ? '<i class="fas fa-check-circle text-success ms-1"></i>' : '<i class="fas fa-times-circle text-danger ms-1"></i>'}</span>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center small mb-2">
                                            <span class="text-secondary">DILR (Cutoff: ${pred.sectionalCutoffs.DILR}%)</span>
                                            <span class="fw-semibold text-dark"><strong>${pred.sectionalsGot.DILR}%</strong> ${pred.sectionalsGot.DILR >= pred.sectionalCutoffs.DILR ? '<i class="fas fa-check-circle text-success ms-1"></i>' : '<i class="fas fa-times-circle text-danger ms-1"></i>'}</span>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center small mb-0">
                                            <span class="text-secondary">QA (Cutoff: ${pred.sectionalCutoffs.QA}%)</span>
                                            <span class="fw-semibold text-dark"><strong>${pred.sectionalsGot.QA}%</strong> ${pred.sectionalsGot.QA >= pred.sectionalCutoffs.QA ? '<i class="fas fa-check-circle text-success ms-1"></i>' : '<i class="fas fa-times-circle text-danger ms-1"></i>'}</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Details & Feedback -->
                                    <h6 class="fw-bold text-secondary small mb-2">Detailed Feedback:</h6>
                                    <div class="p-3 bg-white rounded-3 border border-light-subtle shadow-sm">
                                        ${pred.reasons.map(r => `<p class="small text-muted mb-1"><i class="fas fa-circle-info me-1 text-secondary"></i>${r}</p>`).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }

            resultsContainer.innerHTML += cardHTML;
        });
    }

    resultsSection.classList.add('show');
}

// Global toggle helper for card panel collapses
window.toggleDetails = (btn) => {
    const panel = btn.nextElementSibling;
    if (panel.classList.contains('d-none')) {
        panel.classList.remove('d-none');
        btn.innerHTML = `<i class="fas fa-chevron-up me-1"></i> Hide Evaluation`;
    } else {
        panel.classList.add('d-none');
        btn.innerHTML = `<i class="fas fa-info-circle me-1"></i> Profile Evaluation`;
    }
};

// Toggle consultation sticky drawer
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("consultToggleBtn");
    const consultation = document.getElementById("consultation");
    const closeBtn = document.querySelector(".close-form");

    if (toggleBtn && consultation && closeBtn) {
        toggleBtn.addEventListener("click", () => {
            consultation.classList.add("active");
            toggleBtn.classList.add("hidden");
        });

        closeBtn.addEventListener("click", () => {
            consultation.classList.remove("active");
            toggleBtn.classList.remove("hidden");
        });
    }
});