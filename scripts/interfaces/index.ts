export { ClassificationResult } from '../../src/domain-classifier/interfaces';

export interface LabeledDomain {
  domain: string;
  isEditorial: boolean;
}

export interface BatchResult {
  domain: string;
  isEditorial: boolean;
}

export interface AccuracyMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  correct: number;
  total: number;
  wrongPredictions: Array<WrongPrediction>;
}

export interface WrongPrediction {
  domain: string;
  predicted: boolean;
  actual: boolean;
}