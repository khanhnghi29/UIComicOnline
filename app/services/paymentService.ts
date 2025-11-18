// app/services/paymentService.ts

import { apiClient, tokenManager } from '@/app/lib/api';
import { 
  CreateBookPaymentRequest, 
  CreateSubscriptionPaymentRequest, 
  PaymentResponse,
  BookPurchase,
  SubscriptionPurchase
} from '@/app/types';

// Helper function to get username from token
const getUsernameFromToken = (): string | null => {
  const token = tokenManager.getToken();
  if (!token) return null;
  
  const payload = tokenManager.getTokenPayload(token);
  return payload?.sub || null;
};

export const paymentService = {
  // Purchase a single comic
  async purchaseBook(comicId: number): Promise<PaymentResponse> {
    const response = await apiClient.post<PaymentResponse>(
      `/Payment/book/${comicId}`,
      { comicId } as CreateBookPaymentRequest
    );
    return response.data;
  },

  // Purchase a subscription
  async purchaseSubscription(subscriptionId: number): Promise<PaymentResponse> {
    const response = await apiClient.post<PaymentResponse>(
      `/Payment/subscription/${subscriptionId}`,
      { subscriptionId } as CreateSubscriptionPaymentRequest
    );
    return response.data;
  },

  // Get user's purchased comics
  async getPurchasedBooks(): Promise<BookPurchase[]> {
    const userName = getUsernameFromToken();
    if (!userName) {
      throw new Error('User not authenticated');
    }
    
    const response = await apiClient.get<BookPurchase[]>(`/Users/${userName}/purchased-comics`);
    return response.data;
  },

  // Get user's active subscriptions
  async getActiveSubscriptions(): Promise<SubscriptionPurchase[]> {
    const userName = getUsernameFromToken();
    if (!userName) {
      throw new Error('User not authenticated');
    }
    
    const response = await apiClient.get<SubscriptionPurchase[]>(`/Users/${userName}/active-subscriptions`);
    return response.data;
  },

  // Get all subscription purchases (history)
  async getSubscriptionHistory(): Promise<SubscriptionPurchase[]> {
    const userName = getUsernameFromToken();
    if (!userName) {
      throw new Error('User not authenticated');
    }
    
    const response = await apiClient.get<SubscriptionPurchase[]>(`/Users/${userName}/active-subscriptions`);
    return response.data;
  }
};