/**
 * Type declarations for transactionCache.js
 */

export interface CachedVerification {
  serialHash: string;
  batchId: number;
  serialNumber: string;
  isAuthentic: boolean;
  verifier: string;
  timestamp: number;
  txHash: string;
  blockNumber?: number;
  productName?: string;
  productBrand?: string;
  cachedAt: number;
}

export function getCachedVerifications(): CachedVerification[];
export function addCachedVerification(verification: Omit<CachedVerification, "cachedAt">): void;
export function getCachedVerification(serialHash: string): CachedVerification | null;
export function clearVerificationCache(): void;
export function getCacheStats(): {
  total: number;
  size: number;
  oldest: number | null;
  newest: number | null;
};

