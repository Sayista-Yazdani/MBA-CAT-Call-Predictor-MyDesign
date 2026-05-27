# Sayista Yazdani - CAT Call Predictor

A premium, highly interactive, and structurally accurate profile evaluation and call probability prediction tool designed for MBA aspirants. The application helps candidates determine their chances of receiving interview calls from elite IIMs (Indian Institutes of Management) and top B-schools (e.g., IIM Mumbai, VGSoM, DU DFS/DBE) by simulating realistic institutional composite score formulas.

## 📷 Interface Previews

### 1. High-Accuracy Results Dashboard (Light Colorful Cards)
![Light Colorful Prediction Dashboard](preview/p1.png)

### 2. Interactive Multi-Step Stepper Wizard
![Interactive Profile Stepper Wizard](preview/p2.png)
![Interactive Profile Stepper Wizard](preview/p3.png)
![Interactive Profile Stepper Wizard](preview/p4.png)
![Interactive Profile Stepper Wizard](preview/p5.png)
![Interactive Profile Stepper Wizard](preview/p6.png)
![Interactive Profile Stepper Wizard](preview/p7.png)

---

## 🌟 Key Features

### 1. Executive Editorial Aesthetics (Navy & Gold Theme)
- Designed with an academic executive visual palette featuring deep slate (`#0f172a`), royal navy (`#1e3a8a`), and warm gold/amber accents (`#d97706` / `#fbbf24`).
- Interactive dashboard outcome cards styled with dynamic, soft light-colorful pastel gradients (Emerald green for high chance, warm amber for moderate, sky blue for low, rose coral for ineligible).
- Unclipped, custom-rendered radial SVG progress gauges that clockwise animate Call Chance percentages smoothly without viewport crop issues.

### 2. Mobile-First Stepper Wizard
- Minimizes scrolling fatigue by organizing 25+ detailed profiling questions into a highly engaging, 4-step wizard:
  - **Step 1: Personal Profile** (Name, Gender, Category, PwD Status)
  - **Step 2: Academic Profile** (10th/12th/UG Percentages, Board, Stream, XII Math score, Best-of-Four)
  - **Step 3: Experience & Extra Profile Details** (Work experience months across key target dates, relevance factor, profile strength, professional certifications like CA/CFA/CMA, PG, specialized degree matches)
  - **Step 4: CAT Scores** (Overall & Sectional Percentiles VARC, DILR, QA)
- Built with custom validation layers checking field compliance before step transitions.
- Fully responsive styling: hides stepper labels on smaller screens to prevent overlaps and converts the sticky consultation panel into a modern slide-up bottom drawer.

### 3. Precision Profile Evaluation Engine
Developed a robust predictive algorithm that mimics the authentic composite scoring guidelines utilized by elite business schools:
- **Strict Sectional Audits:** Assesses overall and sectional percentiles (VARC, DILR, QA) against standard minimum cutoffs custom-mapped for all categories (General, OBC-NCL, SC, ST, EWS, and PwD).
- **Academic Slab Conversion:** Converts raw high school and undergraduate marks into authentic slab weight points (e.g. 10th and 12th: `>=90%` = 10 pts, `>=80%` = 8 pts, etc.) instead of simple flat averages.
- **Bell-Curve Work-Ex Scoring:** Awards peak scores for candidates within the golden zone of `22 to 36` months of experience, with tapered scaling for low months or experience exceeding 4 years.
- **Academic & Gender Diversity:** Accurately factors in diversity weight points (Non-Engineering backgrounds like Arts/Commerce/Science, and female/other candidates).
- **Specialized Program Filters:** Verifies qualifications for niche eligibility courses:
  - *IIM Lucknow ABM:* Verified against Agriculture/Biology degrees.
  - *IIM Mumbai OSCM:* Checked for STEM undergraduate fields.
  - *VGSoM IIT Kharagpur:* Requires Engineering/Science backgrounds.
  - *DFS/DBE (DU):* Prefers Commerce/Math backgrounds, using Best of Four and Class XII Math marks.
- **Target CAT Percentile Mode:** If a candidate has not yet taken the CAT exam, the engine dynamically estimates the target overall percentile required to secure calls based on their unique profile composite metrics.

---

## 📂 Project Structure

```bash
MBA-CAT-Call-Predictor-MyDesign/
├── assets/
│   ├── images/
│   │   ├── customer-service.gif     # Consultation floating assistant gif
│   │   ├── preview_wizard.png       # Mockup preview image of form wizard
│   │   └── preview_dashboard.png    # Mockup preview image of results dashboard
│   └── videos/
│       └── iim-campus.mp4           # Hero Section background loop
├── css/
│   ├── style.css                    # Main design tokens, stepper, and circular gauges
│   ├── mediaquary.css               # Responsiveness breakpoints and drawers
│   ├── animation.css                # Fluid keyframes and step transitions
│   └── scroll.css                   # Custom modern scrollbar design
├── preview/
│   │   ├── p1.png     
│   │   ├── p2.png       
│   │   └── p3.png
│   │   └── p4.png
│   │   └── p5.png    
│   │   └── p6.png
│   │   └── p7.png    
├── js/
│   └── script.js                    # Step wizard validation, accurate formulas, SVG drawers
├── index.html                       # Semantic HTML5 wizard and results structure
└── README.md                        # Documentation and architecture guide
```

---

## ⚡ Performance Optimization

We have engineered rapid initial load and action metrics:
- **Async Loader:** Bound splash screen hiding to `DOMContentLoaded` (fades in just `450ms`) rather than waiting for heavy media assets like background videos to fully download.
- **Snappy Calculations:** Synthetic submission spinner delay is optimized to `350ms`, providing a responsive micro-interaction feel before displaying instant results.

---

## 🛠️ Local Development & Deployment

### Prerequisite
A modern web browser and a local web server (e.g., Apache via XAMPP, or VS Code Live Server extension).

### Quick Start
1. Place the project directory under your local web server root directory (e.g. `C:/xampp/htdocs/` or `/Applications/XAMPP/xamppfiles/htdocs/`).
2. Start your Apache server.
3. Open your browser and navigate to:
   ```url
   http://localhost/MBA-CAT-Call-Predictor-MyDesign/index.html
   ```

---

## 🧪 Unit Testing

The calculations engine contains a Node.js-based unit testing suite to programmatically verify profile composite math and cutoff thresholds under various test criteria (General, OBC, GEM, diversity factors, sectional misses).

To run the unit tests:
```bash
node test_predictions.js
```
The test suite validates 4 distinct profile edge cases, outputting visual pass/fail audits to keep logic securely functional.
