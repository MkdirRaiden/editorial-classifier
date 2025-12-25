#!/usr/bin/env node
import { readFileSync } from 'fs';
import { existsSync } from 'fs';
import { resolve } from 'path';
import type { ClassificationResult, LabeledDomain, AccuracyMetrics, WrongPrediction } from './interfaces';

export function getDomainsFilePathFromArgs(defaultPath = 'data/assessment-domains.json'): string {
  const [, , , argPath] = process.argv; 
  if (!argPath) return resolve(process.cwd(), defaultPath);
  
  const resolvedPath = resolve(process.cwd(), argPath);
  if (!existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(1);
  }
  return resolvedPath;
}

export function loadDomains(filePath: string): string[] {
  try {
    const raw = readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('JSON must be array of strings');
    return parsed;
  } catch (error) {
    console.error('Failed to load domains:', error);
    process.exit(1);
  }
}

export function loadLabeled(filePath: string): LabeledDomain[] {
  try {
    const raw = readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('JSON must be array of labeled domains');
    return parsed;
  } catch (error) {
    console.error('Failed to load labeled data:', error);
    process.exit(1);
  }
}

export async function classifyViaHTTP(domains: string[]): Promise<ClassificationResult[]> {
  const response = await fetch('http://localhost:3000/classify-batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domains })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  
  return response.json();
}

export function calculateStats(results: ClassificationResult[]) {
  const total = results.length;
  const editorialCount = results.filter(r => r.isEditorial).length;
  const nonEditorialCount = total - editorialCount;
  
  const byMethod = results.reduce((acc: Record<string, number>, r) => {
    acc[r.method] = (acc[r.method] ?? 0) + 1;
    return acc;
  }, {});

  return { total, editorialCount, nonEditorialCount, byMethod };
}

export function calculateAccuracy(
  labeled: LabeledDomain[], 
  predictions: ClassificationResult[]
): AccuracyMetrics {
  let correct = 0, truePositives = 0, falsePositives = 0, falseNegatives = 0;
  const wrongPredictions: WrongPrediction[] = [];

  labeled.forEach((labeledItem, index) => {
    const { domain, isEditorial: actual } = labeledItem;
    const { isEditorial: predicted } = predictions[index];
    
    if (predicted === actual) {
      correct++;
      if (predicted) truePositives++;
    } else {
      if (predicted) falsePositives++;
      else falseNegatives++;
      wrongPredictions.push({ domain, predicted, actual });
    }
  });

  const total = labeled.length;
  const accuracy = correct / total;
  const precision = truePositives / (truePositives + falsePositives) || 0;
  const recall = truePositives / (truePositives + falseNegatives) || 0;
  const f1 = 2 * (precision * recall) / (precision + recall) || 0;

  return { accuracy, precision, recall, f1, correct, total, wrongPredictions };
}
