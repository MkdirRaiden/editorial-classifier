import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000).catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}
void bootstrap();
