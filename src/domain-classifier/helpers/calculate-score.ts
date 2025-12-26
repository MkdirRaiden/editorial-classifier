import {
  EDITORIAL_REGEX,
  NON_EDITORIAL_REGEX,
} from '@/domain-classifier/config';

export function calculateHeuristicScore(domain: string): {
  isEditorial: boolean;
  confidence: number;
} {
  const lowerDomain = domain.toLowerCase();
  const editorialMatches = (lowerDomain.match(EDITORIAL_REGEX) || []).length;
  const nonEditorialMatches = (lowerDomain.match(NON_EDITORIAL_REGEX) || []).length;

  let score = 0;
  score += editorialMatches * 0.25;
  score -= nonEditorialMatches * 0.35;
  score = Math.max(0, Math.min(1, score));

  const isEditorial = score >= 0.5;
  
  let confidence: number;
  if (score >= 0.8 || score <= 0.2) {
    confidence = 0.95; // Strong signal
  } else if (score >= 0.65 || score <= 0.35) {
    confidence = 0.85; // Medium signal  
  } else {
    confidence = 0.65; // Weak signal LLM candidate
  }

  return { isEditorial, confidence: Number(confidence.toFixed(2)) };
}