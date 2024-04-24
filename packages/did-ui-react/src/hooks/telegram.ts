import { did, handleErrorMessage, setLoading, telegramLoginAuth } from '../utils';
import { getTelegramStartParam, getAccessTokenInDappTelegram, isTelegramPlatform } from '../utils/telegram';
import { useCallback, useEffect, useRef } from 'react';
import { singleMessage } from '../components';
import { NetworkType } from '../types';

export function useGetTelegramAccessToken({
  canGetAuthToken = true,
  autoTelegramAuth = false,
  network,
  storageKeyName,
  callback,
}: {
  canGetAuthToken?: boolean;
  autoTelegramAuth?: boolean;
  network?: NetworkType;
  storageKeyName?: string;
  callback: (decodeResult: any) => Promise<void>;
}) {
  console.log('****** autoTelegramAuth: ', autoTelegramAuth);
  const timerRef = useRef<NodeJS.Timer | number>();
  const startTimeRef = useRef<Date>();

  const checkNeedAutoTelegramAuth = useCallback(async () => {
    if (!autoTelegramAuth) {
      return false;
    }
    const hasStorageAesStr = await did.checkStorageAesStrIsExist(storageKeyName);
    console.log('hasStorageAesStr: ', hasStorageAesStr);
    console.log('isTelegramPlatform(): ', isTelegramPlatform());
    return !hasStorageAesStr && isTelegramPlatform();
  }, [autoTelegramAuth, storageKeyName]);

  const getAccessToken = useCallback(async () => {
    const { startParam } = getTelegramStartParam();
    console.log('??? startParam: ', startParam);
    const needAutoTelegramAuth = await checkNeedAutoTelegramAuth();
    console.log('needAutoTelegramAuth: ', needAutoTelegramAuth);
    if (needAutoTelegramAuth) {
      setLoading(true);
    }
    if (
      needAutoTelegramAuth &&
      !startParam &&
      startTimeRef.current &&
      // TODO: check the duration
      new Date().getTime() - startTimeRef.current.getTime() > 10000
    ) {
      console.log('===== auto telegram auth');
      clearInterval(timerRef.current);
      timerRef.current = undefined;
      await telegramLoginAuth({
        network,
        autoTelegramAuth,
      });
      return;
    }
    if (startParam) {
      setLoading(true);
      clearInterval(timerRef.current);
      timerRef.current = undefined;
      try {
        const decodeResult = await getAccessTokenInDappTelegram(startParam);
        console.log('===res.data', decodeResult);
        if (!decodeResult) return;

        await did.config.storageMethod.removeItem(startParam);
        await callback(decodeResult);
      } catch (error) {
        singleMessage.error(handleErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }
  }, [autoTelegramAuth, callback, checkNeedAutoTelegramAuth, network]);

  useEffect(() => {
    if (canGetAuthToken) {
      console.log('=== useEffect setInterval', '');
      startTimeRef.current = new Date();
      // TODO tg
      timerRef.current = setInterval(() => {
        getAccessToken();
      }, 2000);
    }

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
      startTimeRef.current = undefined;
    };
  }, [canGetAuthToken, getAccessToken]);
}
