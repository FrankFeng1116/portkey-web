import { ChainId } from '@portkey/types';
import { SocialLoginFinishHandler } from '../../../types';
import {
  did,
  getGoogleUserInfo,
  handleErrorCode,
  handleErrorMessage,
  parseAppleIdentityToken,
  setLoading,
} from '../../../utils';
import { useRef, useCallback, useMemo } from 'react';
import { GuardianInputInfo, IBaseGetGuardianProps } from '../../types';
import { AccountType, AccountTypeEnum } from '@portkey/services';
const useSignHandler = ({
  defaultChainId,
  onError,
  onSuccess,
  customValidateEmail,
  customValidatePhone,
  onChainIdChange,
}: {
  defaultChainId: ChainId;
  onError: IBaseGetGuardianProps['onError'];
  onSuccess: IBaseGetGuardianProps['onSuccess'];
  customValidateEmail: IBaseGetGuardianProps['validateEmail'];
  customValidatePhone: IBaseGetGuardianProps['validatePhone'];
  onChainIdChange: IBaseGetGuardianProps['onChainIdChange'];
}) => {
  const isHasAccount = useRef<boolean>(false);

  const validateIdentifier = useCallback(async (identifier?: string): Promise<any> => {
    let isLoginGuardian = false;
    try {
      const { originChainId } = await did.services.getRegisterInfo({
        loginGuardianIdentifier: identifier,
      });

      const payload = await did.getHolderInfo({
        loginGuardianIdentifier: identifier,
        chainId: originChainId,
      });
      if (payload?.guardianList?.guardians?.length > 0) {
        isLoginGuardian = true;
      }
    } catch (error: any) {
      if (handleErrorCode(error) === '3002') {
        isLoginGuardian = false;
      } else {
        throw handleErrorMessage(error || 'GetHolderInfo error');
      }
    }

    isHasAccount.current = isLoginGuardian;
  }, []);

  const validateEmail = useCallback(
    async (email?: string) => {
      setLoading(true, 'Checking account on the chain...');
      await validateIdentifier(email);
      return customValidateEmail?.(email);
    },
    [customValidateEmail, validateIdentifier],
  );

  const validatePhone = useCallback(
    async (phone?: string) => {
      setLoading(true, 'Checking account on the chain...');
      await validateIdentifier(phone?.replaceAll(/\s/g, ''));
      return customValidatePhone?.(phone);
    },
    [customValidatePhone, validateIdentifier],
  );

  const getIdentifierChainId = useCallback(
    async (identifier: string) => {
      let _originChainId = defaultChainId;

      try {
        const { originChainId } = await did.services.getRegisterInfo({
          loginGuardianIdentifier: identifier.replaceAll(/\s/g, ''),
        });
        _originChainId = originChainId;
      } catch (error: any) {
        _originChainId = defaultChainId;
      }
      return _originChainId;
    },
    [defaultChainId],
  );

  const onFinish = useCallback(
    async (value: GuardianInputInfo) => {
      setLoading(true);
      const chainId = await getIdentifierChainId(value.identifier.replaceAll(/\s/g, ''));
      onChainIdChange?.(chainId);
      setLoading(false);
      onSuccess?.({ ...value, isLoginGuardian: isHasAccount.current, chainId });
    },
    [getIdentifierChainId, onChainIdChange, onSuccess],
  );

  const onSocialFinish: SocialLoginFinishHandler = useCallback(
    async ({ type, data }) => {
      try {
        setLoading(true, 'Checking account on the chain...');
        if (!data) throw 'Action error';
        if (type === 'Google') {
          const userInfo = await getGoogleUserInfo(data?.accessToken);
          if (!userInfo?.id) throw userInfo;
          await validateIdentifier(userInfo.id);
          onFinish({
            identifier: userInfo.id,
            accountType: AccountTypeEnum[AccountTypeEnum.Google] as AccountType,
            authenticationInfo: { googleAccessToken: data?.accessToken },
          });
        } else if (type === 'Apple') {
          const userInfo = parseAppleIdentityToken(data?.accessToken);
          if (userInfo) {
            await validateIdentifier(userInfo.userId);
            onFinish({
              identifier: userInfo.userId,
              accountType: AccountTypeEnum[AccountTypeEnum.Apple] as AccountType,
              authenticationInfo: { appleIdToken: data?.accessToken },
            });
          } else {
            throw 'Authorization failed';
          }
        } else {
          throw Error(`AccountType:${type} is not support`);
        }
      } catch (error) {
        setLoading(false);

        const msg = handleErrorMessage(error);
        onError?.({
          errorFields: 'onSocialFinish',
          error: msg,
        });
      }
    },
    [onError, onFinish, validateIdentifier],
  );

  return useMemo(
    () => ({ validateIdentifier, validateEmail, validatePhone, getIdentifierChainId, onFinish, onSocialFinish }),
    [validateIdentifier, validateEmail, validatePhone, getIdentifierChainId, onFinish, onSocialFinish],
  );
};

export default useSignHandler;
