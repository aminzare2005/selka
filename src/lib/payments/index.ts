import { ZibalProvider } from "./providers/zibal";
import type { PaymentProvider } from "./types";

const providers: Record<string, PaymentProvider> = {
  zibal: new ZibalProvider(),
};

export function getPaymentProvider(slug: string): PaymentProvider | null {
  return providers[slug] ?? null;
}

export function listPaymentProviders(): PaymentProvider[] {
  return Object.values(providers);
}
