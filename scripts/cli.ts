#!/usr/bin/env node
import { getDomainsFilePathFromArgs, loadDomains, loadLabeled, classifyViaHTTP, calculateStats, calculateAccuracy } from './utils.js';
import { existsSync } from 'fs';
import { resolve } from 'path';

async function main() {
  const [, , command, filePath] = process.argv; 

  switch (command) {
    case 'batch':
      await runBatch(filePath);
      break;
    case 'accuracy':
      await runAccuracy();
      break;
    default:
      console.log('Usage:\n  npm run batch [file.json]\n  npm run accuracy');
      process.exit(1);
  }
}

async function runBatch(filePath?: string) {
  const domainsFilePath = getDomainsFilePathFromArgs(filePath);
  const domains = loadDomains(domainsFilePath);
  console.log(`Classifying ${domains.length} domains...\n`);
  const results = await classifyViaHTTP(domains);
  console.log(JSON.stringify(results, null, 2));
  console.log('\nStats:', calculateStats(results));
}

async function runAccuracy() {
  const labeledPath = resolve(process.cwd(), 'data/labeled-test-set.json');
  if (!existsSync(labeledPath)) {
    console.error(`labeled-test-set.json not found at ${labeledPath}`);
    process.exit(1);
  }
  
  const labeled = loadLabeled(labeledPath);
  console.log(`Testing ${labeled.length} labeled domains...\n`);

  const predictions = await classifyViaHTTP(labeled.map(item => item.domain));
  const metrics = calculateAccuracy(labeled, predictions);

  console.log('Accuracy Results:');
  console.log(`Accuracy: ${(metrics.accuracy * 100).toFixed(1)}% (${metrics.correct}/${metrics.total})`);
  console.log(`Precision: ${(metrics.precision * 100).toFixed(1)}%`);
  console.log(`Recall: ${(metrics.recall * 100).toFixed(1)}%`);
  console.log(`F1 Score: ${(metrics.f1 * 100).toFixed(1)}%\n`);

  if (metrics.wrongPredictions.length > 0) {
    console.log('Wrong Predictions:');
    metrics.wrongPredictions.forEach(({ domain, predicted, actual }) => {
      console.log(`  ${domain}: predicted=${predicted}, actual=${actual}`);
    });
  } else {
    console.log('Perfect! No wrong predictions.');
  }
}

main().catch(err => {
  console.error('CLI failed:', err);
  process.exit(1);
});
