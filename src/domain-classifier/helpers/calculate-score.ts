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
  const nonEditorialMatches = (lowerDomain.match(NON_EDITORIAL_REGEX) || [])
    .length;

  let score = 0;
  score += editorialMatches * 0.25;
  score -= nonEditorialMatches * 0.35;
  score = Math.max(0, Math.min(1, score));

  const isEditorial = score >= 0.5;
  const distanceFromThreshold = Math.abs(score - 0.5);
  const confidence = Math.min(1.0, distanceFromThreshold * 2);

  return {
    isEditorial,
    confidence: Number(confidence.toFixed(2)),
  };
}
