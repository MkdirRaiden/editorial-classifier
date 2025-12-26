import { WhitelistRule } from '@/domain-classifier/interfaces';

export const LLM_CONFIG = {
  apiKey: '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',
  endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  model: 'meta-llama/llama-3.3-70b-instruct:free',
  maxNewTokens: 3,
  temperature: 0,
  confidence: 0.93,
  fallbackConfidence: 0.65,
};

// console.log('LLM Config:', LLM_CONFIG);

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
      'hbr.org',          
      'techcrunch.com',   
      'kotaku.com',       
      'lemonde.fr',       
      'thehindu.com',     
      'nydailynews.com',  
      'martech.org',      
      'emarketer.com',    
      'warc.com',         
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
