import { vi, describe, it, expect } from 'vitest';
import { usePredictor } from '../hooks/usePredictor';
import type { CandidateProfile } from '../types';

// 💡 LEARN CORRELATION (PHP DEVELOPERS):
// In React, hooks rely on React lifecycle. By mocking React's 'useMemo' hook to simply execute its inner function directly,
// we can test the predictor's mathematical logic like a regular standalone function in pure JS/TS!
vi.mock('react', () => ({
  useMemo: (fn: () => any) => fn(),
}));

describe('MBA CAT Call Predictor - Test Suite', () => {

  // 1. UNIT TESTING: Academic score slabs calculation
  describe('Unit Tests - Academic Score Slabs', () => {
    it('should assign correct points for Class 10th percentages', () => {
      const profile: CandidateProfile = {
        name: 'Test',
        gender: 'Male',
        category: 'General',
        pwd: 'No',
        class10Board: 'CBSE',
        class10Percentage: 95, // Slab >=90 = 10 pts
        class12Board: 'CBSE',
        class12Percentage: 85, // Slab >=80 = 8 pts
        class12Stream: 'Science',
        undergradPercentage: 78, // Slab >=75 = 8 pts
        undergradStream: 'Engineering',
        workExDec: 0,
        workExJuly: 0,
        workExJan: 0,
        workExRelevance: 5,
        profileStrength: 0,
        professionalQual: 'No',
        postGrad: 'No',
        hasCATScore: 'Yes',
        catOverall: 99,
        catVARC: 99,
        catDILR: 99,
        catQA: 99
      };

      const result = usePredictor(profile);
      expect(result.length).toBeGreaterThan(0);
      
      // Academic points should be: 10 (10th) + 8 (12th) + 8 (UG) = 26
      // Undergrad stream is Engineering, Gender is Male -> Diversity = 0
      // Profile strength = 0 -> Extra = 0
      // Total profile score should be: 26 (Acads) + 0 (WorkEx) + 0 (Div) + 0 (Extra) = 26
      expect(result[0].profileScore).toBe(26);
    });

    it('should assign correct points for lower Academic scores', () => {
      const profile: CandidateProfile = {
        name: 'Test Low Acads',
        gender: 'Male',
        category: 'General',
        pwd: 'No',
        class10Board: 'CBSE',
        class10Percentage: 65, // Slab >=60 = 3 pts
        class12Board: 'CBSE',
        class12Percentage: 65, // Slab >=60 = 3 pts
        class12Stream: 'Commerce',
        undergradPercentage: 58, // Slab >=55 = 3 pts
        undergradStream: 'Commerce',
        workExDec: 0,
        workExJuly: 0,
        workExJan: 0,
        workExRelevance: 5,
        profileStrength: 0,
        professionalQual: 'No',
        postGrad: 'No',
        hasCATScore: 'Yes',
        catOverall: 99,
        catVARC: 99,
        catDILR: 99,
        catQA: 99
      };

      const result = usePredictor(profile);
      // Academic points should be: 3 (10th) + 3 (12th) + 3 (UG) = 9
      // Commerce undergrad -> Diversity = 5
      // Male -> Gender Diversity = 0
      // Total Profile Score: 9 (Acads) + 0 (WorkEx) + 5 (Div) + 0 (Extra) = 14
      expect(result[0].profileScore).toBe(14);
    });
  });

  // 2. UNIT TESTING: Work Experience Bell-Curve Point scaling
  describe('Unit Tests - Work Experience Bell-Curve', () => {
    it('should assign 0 points for Freshers (0 months)', () => {
      const baseProfile: CandidateProfile = {
        name: 'Fresher Test',
        gender: 'Male',
        category: 'General',
        pwd: 'No',
        class10Board: 'CBSE',
        class10Percentage: 90, // 10 pts
        class12Board: 'CBSE',
        class12Percentage: 90, // 10 pts
        class12Stream: 'Science',
        undergradPercentage: 85, // 10 pts
        undergradStream: 'Engineering',
        workExDec: 0, // Fresher
        workExJuly: 0,
        workExJan: 0,
        workExRelevance: 5,
        profileStrength: 0,
        professionalQual: 'No',
        postGrad: 'No',
        hasCATScore: 'Yes',
        catOverall: 95,
        catVARC: 95,
        catDILR: 95,
        catQA: 95
      };

      const result = usePredictor(baseProfile);
      // Acads = 30, WorkEx = 0, Diversity = 0, Extra = 0. Profile = 30.
      expect(result[0].profileScore).toBe(30);
    });

    it('should assign maximum 10 points for peak work experience (22 to 36 months)', () => {
      const baseProfile: CandidateProfile = {
        name: 'Peak WorkEx Test',
        gender: 'Male',
        category: 'General',
        pwd: 'No',
        class10Board: 'CBSE',
        class10Percentage: 90, // 10 pts
        class12Board: 'CBSE',
        class12Percentage: 90, // 10 pts
        class12Stream: 'Science',
        undergradPercentage: 85, // 10 pts
        undergradStream: 'Engineering',
        workExDec: 24, // Peak range (22-36) -> 10 pts
        workExJuly: 18,
        workExJan: 25,
        workExRelevance: 5, // Full relevance multiplier
        profileStrength: 0,
        professionalQual: 'No',
        postGrad: 'No',
        hasCATScore: 'Yes',
        catOverall: 95,
        catVARC: 95,
        catDILR: 95,
        catQA: 95
      };

      const result = usePredictor(baseProfile);
      // Acads = 30, WorkEx = 10, Diversity = 0, Extra = 0. Profile = 40.
      expect(result[0].profileScore).toBe(40);
    });

    it('should smoothly decline points for high experience and cap at minimum 3 points', () => {
      const highProfile: CandidateProfile = {
        name: 'High WorkEx Test',
        gender: 'Male',
        category: 'General',
        pwd: 'No',
        class10Board: 'CBSE',
        class10Percentage: 90,
        class12Board: 'CBSE',
        class12Percentage: 90,
        class12Stream: 'Science',
        undergradPercentage: 85,
        undergradStream: 'Engineering',
        workExDec: 60, // >48 months, should smoothly cap at minimum 3 points
        workExJuly: 54,
        workExJan: 61,
        workExRelevance: 5,
        profileStrength: 0,
        professionalQual: 'No',
        postGrad: 'No',
        hasCATScore: 'Yes',
        catOverall: 95,
        catVARC: 95,
        catDILR: 95,
        catQA: 95
      };

      const result = usePredictor(highProfile);
      // Acads = 30, WorkEx = 3, Diversity = 0, Extra = 0. Profile = 33.
      expect(result[0].profileScore).toBe(33);
    });

    it('should apply no penalty when relevance factor is left blank (defaults to maximum 5/5)', () => {
      const emptyRelevanceProfile: CandidateProfile = {
        name: 'Relevance Blank Test',
        gender: 'Male',
        category: 'General',
        pwd: 'No',
        class10Board: 'CBSE',
        class10Percentage: 90,
        class12Board: 'CBSE',
        class12Percentage: 90,
        class12Stream: 'Science',
        undergradPercentage: 85,
        undergradStream: 'Engineering',
        workExDec: 24, // Peak range (10 points)
        workExJuly: 18,
        workExJan: 25,
        workExRelevance: undefined, // Empty / Blank input!
        profileStrength: 0,
        professionalQual: 'No',
        postGrad: 'No',
        hasCATScore: 'Yes',
        catOverall: 95,
        catVARC: 95,
        catDILR: 95,
        catQA: 95
      };

      const result = usePredictor(emptyRelevanceProfile);
      // If empty relevance defaulted to 0, score would have suffered a 40% penalty (WorkEx = 6, Profile = 36).
      // Since we optimized it to default to 5, it gets full points without penalty (WorkEx = 10, Profile = 40).
      expect(result[0].profileScore).toBe(40);
    });
  });

  // 3. REGRESSION TESTING: Ensuring consistent outputs for standard profiles (GEM vs Non-GEM Female)
  describe('Regression Testing - Call Probability Consistency', () => {
    it('should assign a highly competitive score to non-engineering females (Diversity bonus)', () => {
      const femaleArtsProfile: CandidateProfile = {
        name: 'Riya Sen (Arts Female)',
        gender: 'Female', // +5 points gender diversity
        category: 'General',
        pwd: 'No',
        class10Board: 'CBSE',
        class10Percentage: 95, // 10 pts
        class12Board: 'CBSE',
        class12Percentage: 92, // 10 pts
        class12Stream: 'Arts',
        undergradPercentage: 82, // 8 pts
        undergradStream: 'Arts', // +5 points academic diversity
        workExDec: 24, // 10 pts (peak)
        workExJuly: 18,
        workExJan: 25,
        workExRelevance: 5,
        profileStrength: 0,
        professionalQual: 'No',
        postGrad: 'No',
        hasCATScore: 'Yes',
        catOverall: 98,
        catVARC: 98,
        catDILR: 98,
        catQA: 98
      };

      const result = usePredictor(femaleArtsProfile);
      
      // Total profile score should be: 28 (Acads) + 10 (WorkEx) + 10 (Diversity) = 48/60.
      expect(result[0].profileScore).toBe(48);

      // Verify that she has extremely high call probabilities for top colleges (e.g. >90%)
      const topCollege = result.find(r => r.college.includes('IIM Ahmedabad') || r.college.includes('IIM Bangalore'));
      if (topCollege && topCollege.status === 'Eligible') {
        expect(topCollege.chance).toBeGreaterThanOrEqual(80);
      }
    });

    it('should penalize non-diversity engineering males (GEM) in target score matching', () => {
      const gemProfile: CandidateProfile = {
        name: 'Aarav Sharma (GEM)',
        gender: 'Male', // 0 diversity points
        category: 'General',
        pwd: 'No',
        class10Board: 'CBSE',
        class10Percentage: 90, // 10 pts
        class12Board: 'CBSE',
        class12Percentage: 90, // 10 pts
        class12Stream: 'Science',
        undergradPercentage: 80, // 8 pts
        undergradStream: 'Engineering', // 0 diversity points
        workExDec: 0, // 0 pts (Fresher)
        workExJuly: 0,
        workExJan: 0,
        workExRelevance: 5,
        profileStrength: 0,
        professionalQual: 'No',
        postGrad: 'No',
        hasCATScore: 'No', // Target Mode
      };

      const result = usePredictor(gemProfile);
      
      // Profile score: 28 (Acads) + 0 (WorkEx) + 0 (Diversity) = 28/60
      expect(result[0].profileScore).toBe(28);

      // In Target Mode, a GEM profile should require a very high CAT target percentile
      const topIIM = result.find(r => r.college.includes('IIM Ahmedabad'));
      if (topIIM) {
        expect(topIIM.targetPercentile).toBeGreaterThanOrEqual(98.0);
      }
    });
  });

  // 4. END-TO-END (E2E) FLOW SIMULATION TESTING
  describe('E2E Flow Simulation - Stepper Form & Prediction Matching', () => {
    it('should correctly filter and disqualify candidates based on strict sectional cutoffs', () => {
      const disqualifiedProfile: CandidateProfile = {
        name: 'Sectional Failure Candidate',
        gender: 'Male',
        category: 'General',
        pwd: 'No',
        class10Board: 'CBSE',
        class10Percentage: 90,
        class12Board: 'CBSE',
        class12Percentage: 90,
        class12Stream: 'Science',
        undergradPercentage: 80,
        undergradStream: 'Engineering',
        workExDec: 24,
        workExJuly: 18,
        workExJan: 25,
        workExRelevance: 5,
        profileStrength: 0,
        professionalQual: 'No',
        postGrad: 'No',
        hasCATScore: 'Yes',
        catOverall: 99.5, // High overall percentile
        catVARC: 99.0, // High sectional
        catDILR: 98.0, // High sectional
        catQA: 45.0 // Failed sectional cutoff (QA threshold is usually >= 75-80%)
      };

      const result = usePredictor(disqualifiedProfile);
      
      // Top IIMs should mark this candidate as Ineligible due to sectional failure in QA
      const iimAhmedabad = result.find(r => r.college.includes('IIM Ahmedabad'));
      if (iimAhmedabad) {
        expect(iimAhmedabad.status).toBe('Ineligible (Sectional Cutoff)');
        expect(iimAhmedabad.chance).toBe(5); // Minimum cap chance for sectional miss
      }
    });
  });

});
