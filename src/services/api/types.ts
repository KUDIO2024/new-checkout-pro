export interface FlowluResponse<T = any> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface FlowluContactResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface FlowluOpportunityResponse {
  id: number;
  name: string;
  amount: number;
}

export interface FlowluError {
  code: string;
  message: string;
}