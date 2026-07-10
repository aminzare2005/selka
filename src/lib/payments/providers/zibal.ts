import type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProvider,
  VerifyPaymentInput,
  VerifyPaymentResult,
} from "../types";

const ZIBAL_REQUEST_URL = "https://gateway.zibal.ir/v1/request";
const ZIBAL_VERIFY_URL = "https://gateway.zibal.ir/v1/verify";
const ZIBAL_START_URL = "https://gateway.zibal.ir/start";

export class ZibalProvider implements PaymentProvider {
  id = "zibal";
  name = "زیبال";

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const response = await fetch(ZIBAL_REQUEST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant: input.merchantId,
        amount: input.amount,
        callbackUrl: input.callbackUrl,
        orderId: input.orderId,
        description: input.description,
      }),
    });

    const data = await response.json();

    if (data.result !== 100) {
      throw new Error(data.message ?? "خطا در ایجاد پرداخت زیبال");
    }

    return {
      redirectUrl: `${ZIBAL_START_URL}/${data.trackId}`,
      trackId: String(data.trackId),
    };
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    const response = await fetch(ZIBAL_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant: input.merchantId,
        trackId: input.trackId,
      }),
    });

    const data = await response.json();

    return {
      success: data.result === 100,
      refId: data.refNumber ? String(data.refNumber) : undefined,
      status: data.status,
    };
  }
}
