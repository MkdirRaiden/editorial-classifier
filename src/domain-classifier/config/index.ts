import { WhitelistRule } from '@/domain-classifier/interfaces';

export const LLM_CONFIG = {
  HF_ENDPOINT:
    'https://api-inference.huggingface.co/models/microsoft/DialoGPT-small',
  maxNewTokens: 5,
  temperature: 0.1,
  confidence: 0.85,
  fallbackConfidence: 0.6,
};

export const WHITELIST_RULES: WhitelistRule[] = [
  {
    set: new Set([
      'prnewswire.com',
      'fintechfutures.com',
      'fintechmagazine.com',
      'globalfintechseries.com',
      'forbes.com',
      'gamerant.com',
      'thegamer.com',
      'gamesradar.com',
      'engadget.com',
      'gamespot.com',
      'space.com',
      'pcgamer.com',
      'techspot.com',
      'wccftech.com',
      'sportskeeda.com',
      'cbr.com',
      'military.com',
      'nintendolife.com',
      'gamingbolt.com',
      'searchengineland.com',
      'searchenginejournal.com',
      'people.com',
      'time.com',
      'cnbc.com',
      'slate.com',
      'nypost.com',
      'indianexpress.com',
      'politico.com',
      'breitbart.com',
    ]),
    isEditorial: true,
    method: 'whitelist',
  },
  {
    set: new Set([
      'stripe.com',
      'paypal.com',
      'jpmorgan.com',
      'nuvei.com',
      'paysafe.com',
      'checkout.com',
      'worldpay.com',
      'nmi.com',
      'nium.com',
      'payoneer.com',
      'wise.com',
      'amazon.com',
      'github.com',
      'youtube.com',
      'reddit.com',
      'medium.com',
      'dev.to',
      'geeksforgeeks.org',
      'postman.com',
      'coinmarketcap.com',
      'coingecko.com',
      'playstation.com',
      'store.steampowered.com',
      'eneba.com',
    ]),
    isEditorial: false,
    method: 'blacklist',
  },
];

export const EDITORIAL_REGEX =
  /(news|post|times?|journal|daily|magazine|press|herald|tribune|gazette|chronicle)/gi;

export const NON_EDITORIAL_REGEX =
  /pay|stripe|checkout|api|dev|cloud|io|tech/gi;
