import { isHex } from 'viem';

export function validSessionKey(value: string): boolean {
  return isHex(value) && value.length === 66;
}
