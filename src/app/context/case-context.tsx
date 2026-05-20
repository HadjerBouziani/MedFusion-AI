import React, { createContext, useContext, useState, useEffect } from 'react';
import { Case, ModelMetrics } from '../types/case';

interface CaseContextType {
  cases: Case[];
  addCase: (newCase: Case) => void;
  getCaseById: (id: string) => Case | undefined;
  modelMetrics: ModelMetrics;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

// Mock initial data
const mockCases: Case[] = [
  {
    id: '1',
    patientId: 'P-001234',
    imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800',
    imageType: 'xray',
    diagnosis: 'Pneumonia',
    confidence: 87,
    allPredictions: [
      { class: 'Pneumonia', confidence: 87 },
      { class: 'Normal', confidence: 8 },
      { class: 'COVID-19', confidence: 3 },
      { class: 'Tuberculosis', confidence: 2 },
    ],
    heatmapData: [],
    clinicalExplanation: 'The model identified consolidation patterns in the lower right lung field, consistent with bacterial pneumonia. The opacity and air bronchograms are characteristic markers.',
    date: '2026-03-25T10:30:00Z',
    modelVersion: 'v2.3.1',
    imageQuality: 'good',
    similarCases: [
      {
        caseId: '2',
        similarity: 89,
        diagnosis: 'Pneumonia',
        imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800',
        date: '2026-03-20T14:20:00Z',
      },
    ],
  },
  {
    id: '2',
    patientId: 'P-001235',
    imageUrl: 'https://images.unsplash.com/photo-1582719366721-a5f65bc79815?w=800',
    imageType: 'skin',
    diagnosis: 'Melanoma',
    confidence: 92,
    allPredictions: [
      { class: 'Melanoma', confidence: 92 },
      { class: 'Seborrheic Keratosis', confidence: 5 },
      { class: 'Basal Cell Carcinoma', confidence: 2 },
      { class: 'Benign Nevus', confidence: 1 },
    ],
    heatmapData: [],
    clinicalExplanation: 'The model focused on irregular borders and color variation, which are typical indicators of melanoma. The asymmetry and diameter exceeding 6mm further support this diagnosis.',
    uncertaintyWarning: undefined,
    date: '2026-03-20T14:20:00Z',
    modelVersion: 'v2.3.1',
    imageQuality: 'good',
  },
  {
    id: '3',
    patientId: 'P-001236',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800',
    imageType: 'retina',
    diagnosis: 'Diabetic Retinopathy',
    confidence: 78,
    allPredictions: [
      { class: 'Diabetic Retinopathy', confidence: 78 },
      { class: 'Normal', confidence: 15 },
      { class: 'Glaucoma', confidence: 5 },
      { class: 'Macular Degeneration', confidence: 2 },
    ],
    heatmapData: [],
    clinicalExplanation: 'Multiple microaneurysms and hemorrhages detected in the posterior pole, indicating non-proliferative diabetic retinopathy.',
    uncertaintyWarning: 'Moderate confidence. Consider additional testing.',
    date: '2026-03-18T09:15:00Z',
    modelVersion: 'v2.2.9',
    imageQuality: 'fair',
  },
];

const mockMetrics: ModelMetrics = {
  overallAccuracy: 94.2,
  lastUpdated: '2026-03-15',
  improvementRate: 2.3,
  totalCases: 15847,
};

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [modelMetrics] = useState<ModelMetrics>(mockMetrics);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('doctorAppCases');
    if (stored) {
      setCases(JSON.parse(stored));
    } else {
      setCases(mockCases);
    }
  }, []);

  const addCase = (newCase: Case) => {
    const updated = [newCase, ...cases];
    setCases(updated);
    localStorage.setItem('doctorAppCases', JSON.stringify(updated));
  };

  const getCaseById = (id: string) => {
    return cases.find(c => c.id === id);
  };

  return (
    <CaseContext.Provider value={{ cases, addCase, getCaseById, modelMetrics }}>
      {children}
    </CaseContext.Provider>
  );
};

export const useCases = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCases must be used within CaseProvider');
  }
  return context;
};
