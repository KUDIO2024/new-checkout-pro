import { FLOWLU_ENDPOINTS, FLOWLU_PRODUCTS } from './constants';
import { makeRequest } from './request';
import { FlowluApiError } from './errors';
import type { FlowluResponse } from './types';
import type { PlanType } from '../../types/checkout';

interface OpportunityProduct {
  id: number;
  price: number;
  quantity: number;
  description?: string;
}

export function getProducts(plan: PlanType): OpportunityProduct[] {
  return [
    {
      id: plan === 'monthly' 
        ? FLOWLU_PRODUCTS.WEBSITE.MONTHLY.id 
        : FLOWLU_PRODUCTS.WEBSITE.YEARLY.id,
      price: plan === 'monthly'
        ? FLOWLU_PRODUCTS.WEBSITE.MONTHLY.price
        : FLOWLU_PRODUCTS.WEBSITE.YEARLY.price,
      quantity: 1,
      description: `Website Development Package (${plan === 'monthly' ? 'Monthly' : 'Yearly'} Plan)`,
    },
    {
      id: plan === 'monthly'
        ? FLOWLU_PRODUCTS.HOSTING.MONTHLY.id
        : FLOWLU_PRODUCTS.HOSTING.YEARLY.id,
      price: plan === 'monthly'
        ? FLOWLU_PRODUCTS.HOSTING.MONTHLY.price
        : FLOWLU_PRODUCTS.HOSTING.YEARLY.price,
      quantity: 1,
      description: `${plan === 'monthly' ? 'Monthly' : 'Yearly'} Hosting Plan`,
    },
    {
      id: FLOWLU_PRODUCTS.DOMAIN.CO_UK.id,
      price: FLOWLU_PRODUCTS.DOMAIN.CO_UK.price,
      quantity: 1,
      description: 'Domain Registration (.co.uk)',
    },
  ];
}

export async function addProductToOpportunity(
  opportunityId: number,
  product: OpportunityProduct
): Promise<FlowluResponse> {
  try {
    return await makeRequest(
      FLOWLU_ENDPOINTS.PRODUCT,
      {
        lead_id: opportunityId,
        product_id: product.id,
        quantity: product.quantity,
        price: product.price,
        description: product.description,
        currency_id: 1, // GBP
      },
      true
    );
  } catch (error) {
    console.error('Failed to add product to opportunity:', error);
    throw new FlowluApiError('Failed to add product to opportunity');
  }
}