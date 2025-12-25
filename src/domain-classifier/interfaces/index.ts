export type methodType =
  | 'whitelist'
  | 'blacklist'
  | 'heuristics'
  | 'huggingface-llm'
  | 'huggingface-llm-fallback';

export interface ClassificationResult {
  domain: string;
  isEditorial: boolean;
  confidence: number;
  method: methodType;
}

export interface WhitelistRule {
  set: Set<string>;
  isEditorial: boolean;
  method: methodType;
}
