import { useMemo } from 'react';
import type { CandidateProfile, BSchoolPrediction } from '../types';
import { collegeDatabase } from '../data/colleges';

/**
 * Custom React Hook: usePredictor
 * 
 * 💡 LEARN CORRELATION (PHP DEVELOPERS):
 * In PHP, you write a standard function in a helper file that performs calculations.
 * In React, we write a "custom hook" that runs calculations and automatically returns
 * a reactive value that updates the UI whenever the user's form inputs change!
 */
export function usePredictor(profile: CandidateProfile | null): BSchoolPrediction[] {
  // useMemo ensures that we only re-calculate predictions when the profile changes.
  // This is highly efficient and prevents duplicate screen redraws.
  return useMemo(() => {
    if (!profile) return [];

    const predictions: BSchoolPrediction[] = [];

    // Parse numeric values safely
    const hasCAT = profile.hasCATScore === 'Yes';
    const catOverall = Number(profile.catOverall) || 0;
    const catVARC = Number(profile.catVARC) || 0;
    const catDILR = Number(profile.catDILR) || 0;
    const catQA = Number(profile.catQA) || 0;

    const class10 = Number(profile.class10Percentage) || 0;
    const class12 = Number(profile.class12Percentage) || 0;
    const undergrad = Number(profile.undergradPercentage) || 0;

    // Standard work experience benchmarks
    const workExDec = Number(profile.workExDec) || 0;
    const workExRelevance = Number(profile.workExRelevance) || 0;
    const profileStrength = Number(profile.profileStrength) || 0;

    // Map Category (Handles PwD bypass automatically)
    let category = profile.category || 'General';
    if (profile.pwd === 'Yes') {
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
    const workExMultiplier = 0.6 + (workExRelevance / 5) * 0.4;
    workExPoints = Math.min(workExPoints * workExMultiplier, 10);
    workExPoints = Math.round(workExPoints * 10) / 10;

    // Diversity Scores (Max 10)
    const genderDiv = (profile.gender === 'Female' || profile.gender === 'Other') ? 5 : 0;
    const acadDiv = (profile.undergradStream !== 'Engineering') ? 5 : 0;
    const diversityPoints = genderDiv + acadDiv;

    // Professional qualification & PG bonuses (Max 10)
    const professionalBonus = (profile.professionalQual && profile.professionalQual !== 'No') ? 3 : 0;
    const pgBonus = (profile.postGrad === 'Yes') ? 2 : 0;
    const ioeBonus = (profile.ioeInstitute === 'Yes') ? 2 : 0;
    const extraProfilePoints = professionalBonus + pgBonus + ioeBonus + (profileStrength * 0.6); // max 10

    const totalProfileScore = acadScore + workExPoints + diversityPoints + extraProfilePoints; // max 60

    collegeDatabase.forEach(college => {
      // Apply Specialized Eligibility Filters strictly
      if (college.reqAgriBio && profile.agriBioDegree !== 'Yes') return;
      if (college.reqOSCM && profile.iimMumbaiOSCM !== 'Yes') return;
      if (college.reqVgsom && profile.vgsomQualify !== 'Yes') return;
      if (college.reqDfs && profile.dfsdbeDegree !== 'Yes') return;

      const collegeOverallCutoff = college.overallCutoff[category] || college.overallCutoff['General'];
      const secCut = college.sectionalCutoffs[category] || college.sectionalCutoffs['General'];

      let status = 'Eligible';
      let chance = 0;
      let reasons: string[] = [];

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

        const missedSections: string[] = [];
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

          // DYNAMIC DETAILED FEEDBACK FOR ELIGIBLE CANDIDATES
          reasons = [];
          const chanceVal = Math.round(chance);

          if (chanceVal >= 75) {
            reasons.push(`<strong>High Probability:</strong> Your outstanding score of ${catOverall.toFixed(2)} percentile is ${margin.toFixed(2)}% above the required overall threshold (${collegeOverallCutoff.toFixed(2)}%).`);
          } else if (chanceVal >= 40) {
            reasons.push(`<strong>Moderate Probability:</strong> You have crossed the overall benchmark of ${collegeOverallCutoff.toFixed(2)}% by a margin of ${margin.toFixed(2)}%. Keeping your profile strong improves shortlisting.`);
          } else {
            reasons.push(`<strong>Low Probability:</strong> While you clear the cutoff of ${collegeOverallCutoff.toFixed(2)}%, your composite score is slightly marginal. Aim for a stronger percentile.`);
          }

          // Academics dynamic advice
          if (acadScore >= 24) {
            reasons.push(`<strong>Excellent Academics:</strong> Your exceptional academic foundation (10th: ${class10}%, 12th: ${class12}%, UG: ${undergrad}%) awards you a top-tier score of ${acadScore}/30.`);
          } else if (acadScore >= 18) {
            reasons.push(`<strong>Strong Academics:</strong> Consistent scores across school and college (10th: ${class10}%, 12th: ${class12}%) secure a reliable ${acadScore}/30 academic weight.`);
          } else {
            reasons.push(`<strong>Average Academics:</strong> With ${acadScore}/30 academic score, you face higher reliance on scoring extra margins in the CAT exam.`);
          }

          // Sectional buffers
          const secMargins = [];
          if (catVARC - secCut.VARC >= 8) secMargins.push(`VARC (+${(catVARC - secCut.VARC).toFixed(1)}%)`);
          if (catDILR - secCut.DILR >= 8) secMargins.push(`DILR (+${(catDILR - secCut.DILR).toFixed(1)}%)`);
          if (catQA - secCut.QA >= 8) secMargins.push(`QA (+${(catQA - secCut.QA).toFixed(1)}%)`);

          if (secMargins.length > 0) {
            reasons.push(`<strong>Sectional Edge:</strong> You cleared sectionals comfortably, with an exceptional buffer in ${secMargins.join(', ')}.`);
          } else {
            reasons.push(`<strong>Cutoff Cleared:</strong> All individual sectional cutoffs (VARC: ${secCut.VARC}%, DILR: ${secCut.DILR}%, QA: ${secCut.QA}%) are successfully cleared.`);
          }

          // Work experience dynamic feedback
          if (workExDec >= 22 && workExDec <= 36) {
            reasons.push(`<strong>Ideal Work Experience:</strong> Your work-ex of ${workExDec} months lies inside the golden bell-curve (22-36 months), fetching maximum score of ${workExPoints}/10.`);
          } else if (workExDec > 0) {
            reasons.push(`<strong>Work Experience Weight:</strong> ${workExDec} months of professional experience adds a valuable ${workExPoints}/10 to your profile.`);
          } else {
            reasons.push(`<strong>Fresher Advantage:</strong> While work-ex points are zero, several old/new IIMs actively look to balance cohorts with smart freshers.`);
          }

          // Diversity
          const divItems = [];
          if (genderDiv > 0) divItems.push("Gender diversity (+5)");
          if (acadDiv > 0) divItems.push(`Academic diversity (+5 for ${profile.undergradStream})`);
          if (divItems.length > 0) {
            reasons.push(`<strong>Diversity Boost:</strong> Profile scores are strongly elevated by: ${divItems.join(' & ')}.`);
          } else {
            reasons.push(`<strong>GEM / Non-Diversity Profile:</strong> Being a male engineer, you get 0 diversity points. You must target high CAT percentiles to maximize competitiveness.`);
          }

          // Postgraduate/professional qualifications
          const extraItems = [];
          if (professionalBonus > 0) extraItems.push(`${profile.professionalQual} qualification`);
          if (pgBonus > 0) extraItems.push("Post-graduation");
          if (ioeBonus > 0) extraItems.push("National Importance Institute");
          if (extraItems.length > 0) {
            reasons.push(`<strong>Profile Credentials:</strong> Additional bonus points awarded for having a ${extraItems.join(' / ')}.`);
          }
        } else {
          // If ineligible but marginally close (within 2.5 percentile buffer, no sectional misses)
          if (catOverall >= collegeOverallCutoff - 2.5 && missedSections.length === 0) {
            chance = 12;
          } else {
            chance = 5;
          }

          // Support suggestion for ineligible cards
          if (missedSections.length > 0) {
            reasons.push(`<strong>Key Suggestion:</strong> Work on your sectional weak areas. Achieving balanced sectional scores is critical for top IIMs.`);
          } else if (!metOverall) {
            reasons.push(`<strong>Alternative Targets:</strong> Focus on prestigious non-IIM colleges (like DFS, IITs, or Tier 2 options) that match your current percentile range.`);
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

        const targetVal = parseFloat(baseTarget.toFixed(2));
        reasons = [
          `<strong>Target Percentile:</strong> You need approximately <strong>${targetVal.toFixed(2)}%</strong> overall in CAT to safely clear the composite score threshold.`,
          `<strong>Sectionals Target:</strong> Must score at least <strong>VARC: ${secCut.VARC}%, DILR: ${secCut.DILR}%, QA: ${secCut.QA}%</strong>.`,
        ];

        // Add dynamic profile insights to target cards
        if (totalProfileScore >= 35) {
          reasons.push(`<strong>Profile Advantage:</strong> Your high profile score (${totalProfileScore.toFixed(1)}/60) significantly lowers the CAT score needed.`);
        } else if (totalProfileScore < 20) {
          reasons.push(`<strong>Profile Challenge:</strong> A lower profile score (${totalProfileScore.toFixed(1)}/60) means you must aim for 1-2 percentile extra in CAT to be safe.`);
        }

        if (diversityPoints > 0) {
          reasons.push(`<strong>Diversity Cushion:</strong> Diversity benefits (+${diversityPoints}) are already working to lower your target CAT score.`);
        } else {
          reasons.push(`<strong>High Competition:</strong> Non-diversity profile means higher peer competition; aim to exceed target by 1.5 percentile.`);
        }

        predictions.push({
          college: college.name,
          type: college.type,
          tier: college.tier,
          chance: null,
          status: 'Target Mode',
          reasons: reasons,
          overallCutoff: collegeOverallCutoff,
          sectionalCutoffs: secCut,
          sectionalsGot: null,
          profileScore: totalProfileScore,
          targetPercentile: targetVal
        });
      }
    });

    // Sort predictions: Active mode by chance descending, Target mode by difficulty ascending (easiest targets first)
    if (hasCAT) {
      predictions.sort((a, b) => (b.chance || 0) - (a.chance || 0));
    } else {
      predictions.sort((a, b) => (a.targetPercentile || 0) - (b.targetPercentile || 0));
    }

    return predictions;
  }, [profile]);
}
