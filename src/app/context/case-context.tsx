import React, { createContext, useContext, useState, useEffect } from 'react';
import { Case, ModelMetrics } from '../types/case';

interface CaseContextType {
  cases: Case[];
  addCase: (newCase: Case) => void;
  deleteCase: (id: string) => void;
  getCaseById: (id: string) => Case | undefined;
  modelMetrics: ModelMetrics;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

// ── Image URLs by diagnosis ────────────────────────────────────────────────────
// Chest X-Ray
const IMG_XRAY_PNEUMONIA   = 'https://www.bhf.org.uk/-/media/images/information-support/tests/chest-x-ray/normal-chest-x-ray-620x400.jpg?rev=d9cfde6ea0a249649d60284ae972f2da&la=en&h=400&w=620&hash=62E952C7382859AF3089F12EAC596D40';
const IMG_XRAY_NORMAL      = 'https://heart.thecommonvein.net/wp-content/uploads/2019/12/131040.8.jpg';
const IMG_XRAY_TB          = 'https://www.bhf.org.uk/-/media/images/information-support/tests/chest-x-ray/normal-chest-x-ray-620x400.jpg?rev=d9cfde6ea0a249649d60284ae972f2da&la=en&h=400&w=620&hash=62E952C7382859AF3089F12EAC596D40';
// Brain MRI
const IMG_MRI_MENINGIOMA   = 'https://media.springernature.com/full/springer-static/image/art%3A10.1038%2Fs41598-023-41576-6/MediaObjects/41598_2023_41576_Fig1_HTML.jpg';
const IMG_MRI_PITUITARY    = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS681LkOshVEO4yhpve8jMeINdVDJQY4zW3rA&s';
const IMG_MRI_GLIOMA       = 'https://media.springernature.com/full/springer-static/image/art%3A10.1038%2Fs41598-023-41576-6/MediaObjects/41598_2023_41576_Fig1_HTML.jpg';
const IMG_MRI_NOTUMOR      = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS681LkOshVEO4yhpve8jMeINdVDJQY4zW3rA&s';
// Retinal OCT
const IMG_RETINA_CNV       = 'https://www.reviewofoptometry.com/CMSImagesContent/2022/06/RO%20news/06012022%20myopic%20CNV.jpg';
const IMG_RETINA_DME       = 'https://www.reviewofoptometry.com/CMSImagesContent/2022/06/RO%20news/06012022%20myopic%20CNV.jpg';
const IMG_RETINA_DRUSEN    = 'https://www.reviewofoptometry.com/CMSImagesContent/2022/06/RO%20news/06012022%20myopic%20CNV.jpg';
const IMG_RETINA_NORMAL    = 'https://www.reviewofoptometry.com/CMSImagesContent/2022/06/RO%20news/06012022%20myopic%20CNV.jpg';
// Skin Lesion (no skin images provided — reusing retinal as placeholder until replaced)
const IMG_SKIN_MALIGNANT   = 'https://www.reviewofoptometry.com/CMSImagesContent/2022/06/RO%20news/06012022%20myopic%20CNV.jpg';
const IMG_SKIN_BENIGN      = 'https://www.reviewofoptometry.com/CMSImagesContent/2022/06/RO%20news/06012022%20myopic%20CNV.jpg';

// 23 mock cases across 4 modalities:
// Chest X-Ray (7): Normal x3, Pneumonia x3, Tuberculosis x1
// Brain MRI (6): Glioma x2, Meningioma x1, No Tumor x2, Pituitary x1
// Retinal OCT (5): CNV x1, DME x1, Drusen x2, Normal x1
// Skin Lesion (5): Benign x3, Malignant x2
const mockCases: Case[] = [
  // ── Chest X-Ray ───────────────────────────────────────────────────────────
  {
    id: '1',
    patientId: 'P-001234',
    imageUrl: IMG_XRAY_PNEUMONIA,
    imageType: 'xray',
    diagnosis: 'Pneumonia',
    confidence: 87,
    allPredictions: [
      { class: 'Pneumonia', confidence: 87 },
      { class: 'Normal', confidence: 8 },
      { class: 'Tuberculosis', confidence: 5 },
    ],
    heatmapData: [],
    clinicalExplanation: 'Consolidation patterns in the lower right lung field consistent with bacterial pneumonia. The opacity and air bronchograms are characteristic markers.',
    date: '2026-06-08T10:30:00Z',
    modelVersion: 'ResNet18 SSL-FL v2.1',
    imageQuality: 'good',
    similarCases: [],
  },
  {
    id: '2',
    patientId: 'P-001235',
    imageUrl: IMG_XRAY_NORMAL,
    imageType: 'xray',
    diagnosis: 'Normal',
    confidence: 94,
    allPredictions: [
      { class: 'Normal', confidence: 94 },
      { class: 'Pneumonia', confidence: 4 },
      { class: 'Tuberculosis', confidence: 2 },
    ],
    heatmapData: [],
    clinicalExplanation: 'Lung fields appear clear with no consolidation, effusion, or pneumothorax. Heart size and mediastinum are within normal limits.',
    date: '2026-06-05T09:00:00Z',
    modelVersion: 'ResNet18 SSL-FL v2.1',
    imageQuality: 'good',
    similarCases: [],
  },
  {
    id: '3',
    patientId: 'P-001236',
    imageUrl: IMG_XRAY_TB,
    imageType: 'xray',
    diagnosis: 'Tuberculosis',
    confidence: 82,
    allPredictions: [
      { class: 'Tuberculosis', confidence: 82 },
      { class: 'Pneumonia', confidence: 12 },
      { class: 'Normal', confidence: 6 },
    ],
    heatmapData: [],
    clinicalExplanation: 'Upper lobe infiltrates and cavitary lesions detected, highly suggestive of active pulmonary tuberculosis. Sputum culture recommended for confirmation.',
    date: '2026-06-02T11:45:00Z',
    modelVersion: 'DenseNet121 v1.8',
    imageQuality: 'good',
    similarCases: [],
  },
  {
    id: '4',
    patientId: 'P-001237',
    imageUrl: IMG_XRAY_PNEUMONIA,
    imageType: 'xray',
    diagnosis: 'Pneumonia',
    confidence: 89,
    allPredictions: [
      { class: 'Pneumonia', confidence: 89 },
      { class: 'Normal', confidence: 7 },
      { class: 'Tuberculosis', confidence: 4 },
    ],
    heatmapData: [],
    clinicalExplanation: 'Bilateral patchy infiltrates consistent with atypical pneumonia. Clinical correlation with symptoms and CRP levels advised.',
    date: '2026-05-28T14:00:00Z',
    modelVersion: 'ResNet18 SSL-FL v2.1',
    imageQuality: 'good',
    similarCases: [],
  },
  {
    id: '5',
    patientId: 'P-001238',
    imageUrl: IMG_XRAY_NORMAL,
    imageType: 'xray',
    diagnosis: 'Normal',
    confidence: 96,
    allPredictions: [
      { class: 'Normal', confidence: 96 },
      { class: 'Pneumonia', confidence: 3 },
      { class: 'Tuberculosis', confidence: 1 },
    ],
    heatmapData: [],
    clinicalExplanation: 'No acute cardiopulmonary process identified. Lung fields clear bilaterally.',
    date: '2026-05-22T08:30:00Z',
    modelVersion: 'DenseNet121 v1.8',
    imageQuality: 'good',
    similarCases: [],
  },
  {
    id: '6',
    patientId: 'P-001239',
    imageUrl: IMG_XRAY_PNEUMONIA,
    imageType: 'xray',
    diagnosis: 'Pneumonia',
    confidence: 85,
    allPredictions: [
      { class: 'Pneumonia', confidence: 85 },
      { class: 'Normal', confidence: 10 },
      { class: 'Tuberculosis', confidence: 5 },
    ],
    heatmapData: [],
    clinicalExplanation: 'Right lower lobe consolidation with air bronchograms, consistent with lobar pneumonia.',
    date: '2026-05-15T16:20:00Z',
    modelVersion: 'ResNet18 SSL-FL v2.1',
    imageQuality: 'fair',
    similarCases: [],
  },
  {
    id: '7',
    patientId: 'P-001240',
    imageUrl: IMG_XRAY_NORMAL,
    imageType: 'xray',
    diagnosis: 'Normal',
    confidence: 91,
    allPredictions: [
      { class: 'Normal', confidence: 91 },
      { class: 'Pneumonia', confidence: 6 },
      { class: 'Tuberculosis', confidence: 3 },
    ],
    heatmapData: [],
    clinicalExplanation: 'Chest radiograph within normal limits. No evidence of active disease.',
    date: '2026-05-08T10:00:00Z',
    modelVersion: 'DenseNet121 v1.8',
    imageQuality: 'good',
    similarCases: [],
  },

  // ── Brain MRI ─────────────────────────────────────────────────────────────
  {
    id: '8',
    patientId: 'P-001241',
    imageUrl: IMG_MRI_GLIOMA,
    imageType: 'mri',
    diagnosis: 'Glioma',
    confidence: 91,
    allPredictions: [
      { class: 'Glioma', confidence: 91 },
      { class: 'Meningioma', confidence: 5 },
      { class: 'No Tumor', confidence: 3 },
      { class: 'Pituitary', confidence: 1 },
    ],
    heatmapData: [],
    clinicalExplanation: 'Hyperintense lesion with irregular margins in the left frontal lobe consistent with high-grade glioma. Contrast enhancement and surrounding edema noted.',
    date: '2026-06-07T09:30:00Z',
    modelVersion: 'EfficientNetV2 v1.4',
    imageQuality: 'good',
    similarCases: [],
  },
  {
    id: '9',
    patientId: 'P-001242',
    imageUrl: IMG_MRI_NOTUMOR,
    imageType: 'mri',
    diagnosis: 'No Tumor',
    confidence: 95,
    allPredictions: [
      { class: 'No Tumor', confidence: 95 },
      { class: 'Glioma', confidence: 3 },
      { class: 'Meningioma', confidence: 1 },
      { class: 'Pituitary', confidence: 1 },
    ],
    heatmapData: [],
    clinicalExplanation: 'MRI brain reveals no focal lesion, mass effect, or abnormal enhancement. Normal brain parenchyma and ventricular system.',
    date: '2026-06-03T13:00:00Z',
    modelVersion: 'ViT-Base v1.1',
    imageQuality: 'good',
    similarCases: [],
  },
  {
    id: '10',
    patientId: 'P-001243',
    imageUrl: IMG_MRI_MENINGIOMA,
    imageType: 'mri',
    diagnosis: 'Meningioma',
    confidence: 88,
    allPredictions: [
      { class: 'Meningioma', confidence: 88 },
      { class: 'Glioma', confidence: 7 },
      { class: 'No Tumor', confidence: 3 },
      { class: 'Pituitary', confidence: 2 },
    ],
    heatmapData: [],
    clinicalExplanation: 'Extra-axial homogeneously enhancing mass along the right sphenoid wing, consistent with meningioma. No surrounding edema.',
    date: '2026-05-26T10:15:00Z',
    modelVersion: 'EfficientNetV2 v1.4',
    imageQuality: 'good',
    similarCases: [],
  },
  {
    id: '11',
    patientId: 'P-001244',
    imageUrl: IMG_MRI_PITUITARY,
    imageType: 'mri',
    diagnosis: 'Pituitary',
    confidence: 84,
    allPredictions: [
      { class: 'Pituitary', confidence: 84 },
      { class: 'Meningioma', confidence: 9 },
      { class: 'Glioma', confidence: 5 },
      { class: 'No Tumor', confidence: 2 },
    ],
    heatmapData: [],
    clinicalExplanation: 'Sellar and suprasellar mass with upward displacement of the optic chiasm, consistent with pituitary macroadenoma.',
    date: '2026-05-19T15:30:00Z',
    modelVersion: 'ViT-Base v1.1',
    imageQuality: 'good',
    similarCases: [],
  },
  {
    id: '12',
    patientId: 'P-001245',
    imageUrl: IMG_MRI_GLIOMA,
    imageType: 'mri',
    diagnosis: 'Glioma',
    confidence: 93,
    allPredictions: [
      { class: 'Glioma', confidence: 93 },
      { class: 'Meningioma', confidence: 4 },
      { class: 'No Tumor', confidence: 2 },
      { class: 'Pituitary', confidence: 1 },
    ],
    heatmapData: [],
    clinicalExplanation: 'Ring-enhancing lesion in the right temporal lobe with significant mass effect and midline shift, consistent with glioblastoma multiforme.',
    date: '2026-05-12T08:45:00Z',
    modelVersion: 'EfficientNetV2 v1.4',
    imageQuality: 'good',
    similarCases: [],
  },
  {
    id: '13',
    patientId: 'P-001246',
    imageUrl: IMG_MRI_NOTUMOR,
    imageType: 'mri',
    diagnosis: 'No Tumor',
    confidence: 97,
    allPredictions: [
      { class: 'No Tumor', confidence: 97 },
      { class: 'Glioma', confidence: 2 },
      { class: 'Meningioma', confidence: 1 },
      { class: 'Pituitary', confidence: 0 },
    ],
    heatmapData: [],
    clinicalExplanation: 'No intracranial neoplasm identified. Brain structures symmetric and unremarkable.',
    date: '2026-05-05T11:00:00Z',
    modelVersion: 'ViT-Base v1.1',
    imageQuality: 'good',
    similarCases: [],
  },

  // ── Retinal OCT ───────────────────────────────────────────────────────────
  {
    id: '14',
    patientId: 'P-001247',
    imageUrl: IMG_RETINA_CNV,
    imageType: 'retina',
    diagnosis: 'CNV',
    confidence: 88,
    allPredictions: [
      { class: 'CNV', confidence: 88 },
      { class: 'DME', confidence: 7 },
      { class: 'Drusen', confidence: 3 },
      { class: 'Normal', confidence: 2 },
    ],
    heatmapData: [],
    clinicalExplanation: 'Choroidal neovascularization detected with subretinal fluid and disruption of the RPE layer. Anti-VEGF therapy recommended.',
    date: '2026-06-06T10:00:00Z',
    modelVersion: 'OCT CNN SSL-FL v2.0',
    imageQuality: 'good',
    similarCases: [],
  },
  {
    id: '15',
    patientId: 'P-001248',
    imageUrl: IMG_RETINA_DME,
    imageType: 'retina',
    diagnosis: 'DME',
    confidence: 83,
    allPredictions: [
      { class: 'DME', confidence: 83 },
      { class: 'CNV', confidence: 9 },
      { class: 'Drusen', confidence: 5 },
      { class: 'Normal', confidence: 3 },
    ],
    heatmapData: [],
    clinicalExplanation: 'Diabetic macular edema with intraretinal cystoid spaces and subretinal fluid in the central macula. Intravitreal injection considered.',
    uncertaintyWarning: 'Moderate confidence. Consider additional testing.',
    date: '2026-05-29T14:30:00Z',
    modelVersion: 'OCT CNN SSL-FL v2.0',
    imageQuality: 'fair',
    similarCases: [],
  },
  {
    id: '16',
    patientId: 'P-001249',
    imageUrl: IMG_RETINA_DRUSEN,
    imageType: 'retina',
    diagnosis: 'Drusen',
    confidence: 90,
    allPredictions: [
      { class: 'Drusen', confidence: 90 },
      { class: 'Normal', confidence: 6 },
      { class: 'CNV', confidence: 3 },
      { class: 'DME', confidence: 1 },
    ],
    heatmapData: [],
    clinicalExplanation: 'Multiple soft drusen deposits beneath the RPE, consistent with intermediate age-related macular degeneration. Monitoring recommended.',
    date: '2026-05-20T09:00:00Z',
    modelVersion: 'OCT CNN SSL-FL v2.0',
    imageQuality: 'good',
    similarCases: [],
  },
  {
    id: '17',
    patientId: 'P-001250',
    imageUrl: IMG_RETINA_DRUSEN,
    imageType: 'retina',
    diagnosis: 'Drusen',
    confidence: 86,
    allPredictions: [
      { class: 'Drusen', confidence: 86 },
      { class: 'Normal', confidence: 8 },
      { class: 'CNV', confidence: 4 },
      { class: 'DME', confidence: 2 },
    ],
    heatmapData: [],
    clinicalExplanation: 'Hard and soft drusen visible in the macular region bilaterally. Early AMD changes noted; annual follow-up OCT advised.',
    date: '2026-05-10T16:00:00Z',
    modelVersion: 'OCT CNN SSL-FL v2.0',
    imageQuality: 'good',
    similarCases: [],
  },
  {
    id: '18',
    patientId: 'P-001251',
    imageUrl: IMG_RETINA_NORMAL,
    imageType: 'retina',
    diagnosis: 'Normal',
    confidence: 95,
    allPredictions: [
      { class: 'Normal', confidence: 95 },
      { class: 'Drusen', confidence: 3 },
      { class: 'DME', confidence: 1 },
      { class: 'CNV', confidence: 1 },
    ],
    heatmapData: [],
    clinicalExplanation: 'Normal macular architecture with intact photoreceptor layer. No drusen, fluid, or neovascularization identified.',
    date: '2026-04-30T11:30:00Z',
    modelVersion: 'OCT CNN SSL-FL v2.0',
    imageQuality: 'good',
    similarCases: [],
  },

  // ── Skin Lesion ───────────────────────────────────────────────────────────
  {
    id: '19',
    patientId: 'P-001252',
    imageUrl: IMG_SKIN_MALIGNANT,
    imageType: 'skin',
    diagnosis: 'Malignant',
    confidence: 92,
    allPredictions: [
      { class: 'Malignant', confidence: 92 },
      { class: 'Benign', confidence: 8 },
    ],
    heatmapData: [],
    clinicalExplanation: 'Irregular borders, asymmetry, and heterogeneous pigmentation detected. Features consistent with malignant melanoma. Biopsy strongly recommended.',
    date: '2026-06-07T09:00:00Z',
    modelVersion: 'HBEA SSL-FL v1.0',
    imageQuality: 'good',
    similarCases: [],
  },
  {
    id: '20',
    patientId: 'P-001253',
    imageUrl: IMG_SKIN_BENIGN,
    imageType: 'skin',
    diagnosis: 'Benign',
    confidence: 94,
    allPredictions: [
      { class: 'Benign', confidence: 94 },
      { class: 'Malignant', confidence: 6 },
    ],
    heatmapData: [],
    clinicalExplanation: 'Well-defined, symmetric lesion with uniform coloration. Features consistent with benign melanocytic nevus. Routine monitoring advised.',
    date: '2026-06-04T14:00:00Z',
    modelVersion: 'EfficientNetV2B3',
    imageQuality: 'good',
    similarCases: [],
  },
  {
    id: '21',
    patientId: 'P-001254',
    imageUrl: IMG_SKIN_BENIGN,
    imageType: 'skin',
    diagnosis: 'Benign',
    confidence: 89,
    allPredictions: [
      { class: 'Benign', confidence: 89 },
      { class: 'Malignant', confidence: 11 },
    ],
    heatmapData: [],
    clinicalExplanation: 'Smooth border and homogeneous color distribution. Consistent with seborrheic keratosis, a benign epidermal growth.',
    date: '2026-05-24T11:00:00Z',
    modelVersion: 'Attention',
    imageQuality: 'good',
    similarCases: [],
  },
  {
    id: '22',
    patientId: 'P-001255',
    imageUrl: IMG_SKIN_MALIGNANT,
    imageType: 'skin',
    diagnosis: 'Malignant',
    confidence: 87,
    allPredictions: [
      { class: 'Malignant', confidence: 87 },
      { class: 'Benign', confidence: 13 },
    ],
    heatmapData: [],
    clinicalExplanation: 'Ulcerated nodule with pearly borders and telangiectasia, characteristic of basal cell carcinoma. Surgical excision recommended.',
    date: '2026-05-12T15:00:00Z',
    modelVersion: 'HBEA SSL-FL v1.0',
    imageQuality: 'good',
    similarCases: [],
  },
  {
    id: '23',
    patientId: 'P-001256',
    imageUrl: IMG_SKIN_BENIGN,
    imageType: 'skin',
    diagnosis: 'Benign',
    confidence: 96,
    allPredictions: [
      { class: 'Benign', confidence: 96 },
      { class: 'Malignant', confidence: 4 },
    ],
    heatmapData: [],
    clinicalExplanation: 'Regular, well-circumscribed lesion with no atypical features. Dermatofibroma confirmed. No further intervention required.',
    date: '2026-04-28T13:30:00Z',
    modelVersion: 'EfficientNetV2B3',
    imageQuality: 'good',
    similarCases: [],
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
    const stored = localStorage.getItem('doctorAppCases');
    if (stored) {
      const parsed: Case[] = JSON.parse(stored);
      if (parsed.length >= mockCases.length) {
        setCases(parsed);
      } else {
        setCases(mockCases);
        localStorage.setItem('doctorAppCases', JSON.stringify(mockCases));
      }
    } else {
      setCases(mockCases);
    }
  }, []);

  const addCase = (newCase: Case) => {
    const updated = [newCase, ...cases];
    setCases(updated);
    localStorage.setItem('doctorAppCases', JSON.stringify(updated));
  };

  const deleteCase = (id: string) => {
    const updated = cases.filter(c => c.id !== id);
    setCases(updated);
    localStorage.setItem('doctorAppCases', JSON.stringify(updated));
  };

  const getCaseById = (id: string) => {
    return cases.find(c => c.id === id);
  };

  return (
    <CaseContext.Provider value={{ cases, addCase, deleteCase, getCaseById, modelMetrics }}>
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