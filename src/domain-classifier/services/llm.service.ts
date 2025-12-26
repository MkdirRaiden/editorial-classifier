import { Injectable, Logger } from '@nestjs/common';
import type {
  ClassificationResult,
  OpenRouterResponse,
} from '@/domain-classifier/interfaces';
import { LLM_CONFIG } from '@/domain-classifier/config';

@Injectable()
export class LlmClassificationService {
  private readonly logger = new Logger(LlmClassificationService.name);

  async classify(domain: string): Promise<ClassificationResult> {
    try {
      const response = await fetch(LLM_CONFIG.endpoint, {
        method: 'POST' as const,
        headers: {
          Authorization: `Bearer ${LLM_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Editorial Classifier',
        },
        body: JSON.stringify({
          model: LLM_CONFIG.model,
          messages: [
            {
              role: 'user',
              content: `YES or NO only: ${domain} news site?`,
            },
          ],
          max_tokens: LLM_CONFIG.maxNewTokens,
          temperature: LLM_CONFIG.temperature,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API: ${response.status}`);
      }

      const data: OpenRouterResponse =
        (await response.json()) as OpenRouterResponse;
      const llmText = data.choices?.[0]?.message?.content?.toUpperCase() || '';
      const isEditorial = llmText.includes('YES');

      return {
        domain,
        isEditorial,
        confidence: LLM_CONFIG.confidence,
        method: 'llm',
      };
    } catch (error: unknown) {
      this.logger.warn(`LLM failed (${domain}): ${(error as Error).message}`);
      return {
        domain,
        isEditorial: false,
        confidence: LLM_CONFIG.fallbackConfidence,
        method: 'llm-fallback',
      };
    }
  }
}
