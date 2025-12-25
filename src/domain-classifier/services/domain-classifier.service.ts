import { Injectable } from '@nestjs/common';
import { ClassificationRulesService } from '@/domain-classifier/services/classification-rules.service';
import { ClassificationResult } from '@/domain-classifier/interfaces';
import * as helpers from '@/domain-classifier/helpers';

@Injectable()
export class DomainClassifierService {
  constructor(private readonly rules: ClassificationRulesService) {}

  async classifyDomain(domain: string): Promise<ClassificationResult> {
    const normalized = helpers.normalizeDomain(domain);
    return this.rules.classify(normalized);
  }

  async classifyBatch(domains: string[]): Promise<ClassificationResult[]> {
    return Promise.all(domains.map((domain) => this.classifyDomain(domain)));
  }
}
