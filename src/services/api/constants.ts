export const FLOWLU_ENDPOINTS = {
  CONTACT: '/crm/contact/create',
  OPPORTUNITY: '/crm/lead/create',
  PRODUCT: '/crm/lead_product/create',
} as const;

export const FLOWLU_CONFIG = {
  API_KEY: 'RmFLYnowblNWNXp5eXh6UDBPNGF5ZXdVOW1UUjdlekxfMTExMjc5',
  BASE_URL: 'https://kudio.flowlu.com/api/v1/module',
  PIPELINE_ID: 2,
  PIPELINE_STAGE_ID: 1,
  CURRENCY_ID: 1, // GBP
  ASSIGNEE_ID: 1,
} as const;

export const FLOWLU_PRODUCTS = {
  WEBSITE: {
    MONTHLY: { id: 14, price: 450 },
    YEARLY: { id: 33, price: 369 },
  },
  HOSTING: {
    MONTHLY: { id: 20, price: 15 },
    YEARLY: { id: 3, price: 150 },
  },
  DOMAIN: {
    CO_UK: { id: 25, price: 12 },
  },
  EMAIL: {
    BASIC: { id: 30, price: 19.20, name: 'Basic Email Hosting' },
    STANDARD: { id: 31, price: 43.20, name: 'Standard Email Hosting' },
    BUSINESS: { id: 32, price: 69.99, name: 'Business Email Hosting' },
  },
} as const;