import { IBaseRequest } from '@portkey/types';
import { BaseService } from '../types';
import queryString from 'query-string';
import { IConnectService, IConnectToken, RefreshTokenConfig } from '../types/connect';

export class Connect<T extends IBaseRequest = IBaseRequest> extends BaseService<T> implements IConnectService {
  getConnectToken(token: RefreshTokenConfig): Promise<IConnectToken> {
    return this._request.send({
      method: 'POST',
      url: '/connect/token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: queryString.stringify(token),
    });
  }
}
