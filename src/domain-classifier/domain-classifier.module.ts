import { Module } from '@nestjs/common';
import { DomainClassifierService } from '@/domain-classifier/services/domain-classifier.service';
import { ClassificationRulesService } from './services/classification-rules.service';
import { LlmClassificationService } from './services/llm.service';

@Module({
  providers: [
    DomainClassifierService,
    ClassificationRulesService,
    LlmClassificationService,
  ],
  exports: [DomainClassifierService],
})
export class DomainClassifierModule {}
