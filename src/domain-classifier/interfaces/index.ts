export type methodType =
  | 'whitelist'
  | 'blacklist'
  | 'heuristics'
  | 'llm'
  | 'llm-fallback';

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

interface OpenRouterChoice {
  message: {
    content: string;
  };
}

export interface OpenRouterResponse {
  choices?: OpenRouterChoice[];
}
