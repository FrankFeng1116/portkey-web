import { BaseCryptoManager } from './base';
import { ICryptoManager, KeyPairJSON } from './types';

export class WebCryptoManager extends BaseCryptoManager implements ICryptoManager {
  private crypto: CryptoLike;

  constructor(crypto: CryptoLike) {
    super();
    this.crypto = crypto;
  }

  /**
   * Generates a pair of `JsonWebKey`, both can be used to encrypt and decrypt data.
   * @returns a pair of `JsonWebKey`
   */
  public generateKeyPair = async (): Promise<KeyPairJSON> => {
    const key = await this.crypto.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: 'SHA-512' },
      },
      true,
      ['encrypt', 'decrypt'],
    );
    const privateKey = await this.crypto.exportKey('jwk', key.privateKey);
    const publicKey = await this.crypto.exportKey('jwk', key.publicKey);
    return { publicKey: JSON.stringify(publicKey), privateKey: JSON.stringify(privateKey) };
  };

  /**
   * Provides a way to encrypt data with `cryptoKey`.
   * @param cryptoKey - `JsonWebKey` generated by `generateKeyPair`
   * @param data - data to be encrypted
   * @returns encrypted data
   */
  public encrypt = async (cryptoKey: string | JsonWebKey, data: string): Promise<string> => {
    if (typeof cryptoKey === 'string') {
      cryptoKey = JSON.parse(cryptoKey) as JsonWebKey;
    }
    const encrypted = await this.crypto.encrypt(
      {
        name: 'RSA-OAEP',
      },
      await this.crypto.importKey('jwk', cryptoKey, { name: 'RSA-OAEP', hash: { name: 'SHA-512' } }, true, ['encrypt']),
      new TextEncoder().encode(data),
    );
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  };

  /**
   * Decrypts the encrypted data with `cryptoKey`.
   * @param cryptoKey - `JsonWebKey` generated by `generateKeyPair`
   * @param data - encrypted data
   * @returns decrypted data
   */
  public decrypt = async (cryptoKey: string | JsonWebKey, data: string): Promise<string> => {
    if (typeof cryptoKey === 'string') {
      cryptoKey = JSON.parse(cryptoKey) as JsonWebKey;
    }
    const decrypted = await this.crypto.decrypt(
      {
        name: 'RSA-OAEP',
      },
      await this.crypto.importKey('jwk', cryptoKey, { name: 'RSA-OAEP', hash: { name: 'SHA-512' } }, true, ['decrypt']),
      Uint8Array.from(atob(data), c => c.charCodeAt(0)),
    );
    return new TextDecoder().decode(decrypted);
  };
}
export type CryptoLike = Pick<SubtleCrypto, 'generateKey' | 'encrypt' | 'decrypt' | 'exportKey' | 'importKey'>;