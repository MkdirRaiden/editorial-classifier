import { Module } from '@nestjs/common';
import { DomainClassifierService } from '@/domain-classifier/services/domain-classifier.service';
import { ClassificationRulesService } from '@/domain-classifier/services/classification-rules.service';
import { LlmClassificationService } from '@/domain-classifier//services/llm.service';

@Module({
  providers: [
    DomainClassifierService,
    ClassificationRulesService,
    LlmClassificationService,
  ],
  exports: [DomainClassifierService],
})
export class DomainClassifierModule {}
