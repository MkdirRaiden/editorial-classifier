import { Injectable } from '@nestjs/common';
import type { ClassificationResult } from '@/domain-classifier/interfaces';
import { WHITELIST_RULES } from '@/domain-classifier/config';
import * as helpers from '@/domain-classifier/helpers';
import { LlmClassificationService } from '@/domain-classifier/services/llm.service';

@Injectable()
export class ClassificationRulesService {
  constructor(private readonly llmService: LlmClassificationService) {}

  async classify(normalizedDomain: string): Promise<ClassificationResult> {
    const whitelistResult = this.checkWhitelist(normalizedDomain);
    if (whitelistResult) return whitelistResult;

    const { isEditorial, confidence } =
      helpers.calculateHeuristicScore(normalizedDomain);

    if (confidence < 0.3) {
      return await this.llmService.classify(normalizedDomain);
    }

    return {
      domain: normalizedDomain,
      isEditorial,
      confidence,
      method: 'heuristics',
    };
  }

  private checkWhitelist(domain: string): ClassificationResult | null {
    for (const rule of WHITELIST_RULES) {
      if (rule.set.has(domain)) {
        return {
          domain,
          isEditorial: rule.isEditorial,
          confidence: 1.0,
          method: rule.method,
        };
      }
    }
    return null;
  }
}
