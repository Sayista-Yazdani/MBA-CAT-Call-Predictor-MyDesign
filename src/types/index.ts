export interface BSchool {
  name: string;
  overallCutoff: Record<string, number>;
  sectionalCutoffs: Record<string, Record<string, number>>;
  type: string;
  tier: string;
  reqAgriBio?: boolean;
  reqOSCM?: boolean;
  reqVgsom?: boolean;
  reqDfs?: boolean;
  heavyAcads?: boolean;
}

export interface CandidateProfile {
  name: string;
  gender: string;
  category: string;
  pwd: string;
  class10Board: string;
  class10Percentage: number;
  class12Board: string;
  class12Percentage: number;
  class12Stream: string;
  undergradPercentage: number;
  undergradStream: string;
  class12MathMarks?: number;
  class12BestFour?: number;
  workExJuly: number;
  workExDec: number;
  workExJan: number;
  workExRelevance: number;
  profileStrength: number;
  professionalQual: string;
  postGrad: string;
  nirfRank?: number;
  agriBioDegree: string;
  ioeInstitute: string;
  iimMumbaiOSCM: string;
  vgsomQualify: string;
  dfsdbeDegree: string;
  hasCATScore: string;
  catOverall?: number;
  catVARC?: number;
  catDILR?: number;
  catQA?: number;
}

export interface BSchoolPrediction {
  college: string;
  type: string;
  tier: string;
  chance: number | null;
  status: string;
  reasons: string[];
  overallCutoff: number;
  sectionalCutoffs: Record<string, number>;
  sectionalsGot: Record<string, number> | null;
  profileScore: number;
  targetPercentile: number | null;
}
