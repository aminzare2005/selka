export type CreatePaymentInput = {
  amount: number;
  orderId: string;
  callbackUrl: string;
  description: string;
  merchantId: string;
};

export type CreatePaymentResult = {
  redirectUrl: string;
  trackId: string;
};

export type VerifyPaymentInput = {
  trackId: string;
  merchantId: string;
};

export type VerifyPaymentResult = {
  success: boolean;
  refId?: string;
  status?: number;
};

export interface PaymentProvider {
  id: string;
  name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult>;
}
