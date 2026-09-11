const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7073';

export function resolveProductImageUrl(imageUrl?: string): string | undefined {
  if (!imageUrl) return undefined;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  const base = API_BASE_URL.replace(/\/$/, '');
  return `${base}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
}

export function formatProductSpecs(properties?: Record<string, string>): string {
  if (!properties) return '';
  return Object.values(properties).filter(Boolean).join(' - ');
}

export type StockStatus = 'in' | 'low' | 'out';

export function getStockStatus(
  totalQuantity: number,
  isOutOfStock: boolean,
  isLowStock: boolean,
  minQuantityAlert: number
): StockStatus {
  if (isOutOfStock || totalQuantity <= 0) return 'out';
  if (isLowStock || totalQuantity <= minQuantityAlert) return 'low';
  return 'in';
}
