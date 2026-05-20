export interface Case {
  id: string;
  patientId: string;
  imageUrl: string;
  imageType: 'xray' | 'skin' | 'retina' | 'ct' | 'mri';
  diagnosis: string;
  confidence: number;
  allPredictions: Prediction[];
  heatmapData: number[][];
  clinicalExplanation: string;
  uncertaintyWarning?: string;
  date: string;
  modelVersion: string;
  imageQuality: 'good' | 'fair' | 'poor';
  similarCases?: SimilarCase[];
}

export interface Prediction {
  class: string;
  confidence: number;
}

export interface SimilarCase {
  caseId: string;
  similarity: number;
  diagnosis: string;
  imageUrl: string;
  date: string;
}

export interface ModelMetrics {
  overallAccuracy: number;
  lastUpdated: string;
  improvementRate: number;
  totalCases: number;
}
