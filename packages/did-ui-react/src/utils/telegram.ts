import { TelegramWebappInitData } from '@portkey/types';
import { UserGuardianStatus } from '../types';
import { TelegramPlatform, did } from '.';

export function hasCurrentTelegramGuardian(guardianList?: UserGuardianStatus[]) {
  return guardianList?.some(
    (item) => item?.guardianType === 'Telegram' && item?.guardianIdentifier === TelegramPlatform.getTelegramUserId(),
  );
}

export async function generateAccessTokenByPortkeyServer(telegramUserInfo: TelegramWebappInitData) {
  return await did.services.getTelegramAuthToken(telegramUserInfo);
}
