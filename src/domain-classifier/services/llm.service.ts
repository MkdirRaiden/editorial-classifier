import { Injectable, Logger } from '@nestjs/common';
import type { ClassificationResult } from '@/domain-classifier/interfaces';
import { LLM_CONFIG } from '@/domain-classifier/config';

interface HFResponse {
  generated_text?: string;
}

@Injectable()
export class LlmClassificationService {
  private readonly logger = new Logger(LlmClassificationService.name);

  async classify(domain: string): Promise<ClassificationResult> {
    try {
      const response = await fetch(LLM_CONFIG.HF_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: `CLASSIFY: Is "${domain}" news/editorial? YES/NO only.`,
          parameters: {
            max_new_tokens: LLM_CONFIG.maxNewTokens,
            temperature: LLM_CONFIG.temperature,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HF API: ${response.status}`);
      }

      const data = (await response.json()) as HFResponse[];
      const llmText = (data[0]?.generated_text || '').toUpperCase();
      const isEditorial = llmText.includes('YES');

      return {
        domain,
        isEditorial,
        confidence: LLM_CONFIG.confidence,
        method: 'huggingface-llm',
      };
    } catch (error: unknown) {
      this.logger.warn(
        `❌ LLM failed (${domain}): ${(error as Error).message}`,
      );
      return {
        domain,
        isEditorial: false,
        confidence: LLM_CONFIG.fallbackConfidence,
        method: 'huggingface-llm-fallback',
      };
    }
  }
}
