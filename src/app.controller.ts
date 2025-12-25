import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { DomainClassifierService } from '@/domain-classifier/services/domain-classifier.service';
import { ClassificationResult } from '@/domain-classifier/interfaces';

@Controller()
export class AppController {
  constructor(private readonly classifier: DomainClassifierService) {}

  @Get('classify')
  classify(@Query('domain') domain: string) {
    return this.classifier.classifyDomain(domain);
  }

  @Post('classify-batch')
  async classifyBatch(
    @Body('domains') domains: string[],
  ): Promise<ClassificationResult[]> {
    return this.classifier.classifyBatch(domains);
  }

  @Get()
  getHello() {
    return { message: 'Welcome to Editorial Classifier!' };
  }
}
