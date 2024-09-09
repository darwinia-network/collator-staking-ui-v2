import { HexString } from '@polkadot/util/types';
import { u8aConcat, u8aToU8a } from '@polkadot/util';
import { xxhashAsU8a } from '@polkadot/util-crypto';

// TODO
export function twox64Concat(data: HexString | Uint8Array): Uint8Array {
  return u8aConcat(xxhashAsU8a(data, 64), u8aToU8a(data));
}
