import { memo, useMemo, useState, useCallback, useRef } from 'react';
import { IBaseGetGuardianProps } from '../types';
import { AccountType } from '@portkey/services';
import Overview from './components/Overview';
import ScanCard from '../ScanCard/index.component';
import CustomSvg from '../CustomSvg';
import InputLogin from '../InputLogin';
import { errorTip, handleErrorMessage, setLoading } from '../../utils';
import ConfigProvider from '../config-provider';
import useSocialLogin from '../../hooks/useSocialLogin';
import clsx from 'clsx';
import useSignHandler from '../SignStep/utils';
import { usePortkey } from '../context';
import './index.less';

type UserInputType = AccountType | 'Scan' | null;
export interface UserInputProps extends IBaseGetGuardianProps {
  type?: UserInputType;
}

function UserInput({
  style,
  type = null,
  defaultChainId = 'AELF',
  className,
  isErrorTip = true,
  isShowScan: showScan = true,
  phoneCountry,
  extraElement,
  termsOfService,
  onError,
  onSuccess,
  validateEmail: defaultValidateEmail,
  validatePhone: defaultValidatePhone,
  onChainIdChange,
  onLoginFinishWithoutPin,
}: UserInputProps) {
  const [accountType, setAccountType] = useState<UserInputType>(type);
  const validateEmailRef = useRef<UserInputProps['validateEmail']>(defaultValidateEmail);
  const validatePhoneRef = useRef<UserInputProps['validatePhone']>(defaultValidatePhone);
  const onChainIdChangeRef = useRef<UserInputProps['onChainIdChange']>(onChainIdChange);
  const onErrorRef = useRef<UserInputProps['onError']>(onError);

  const socialLogin = useMemo(() => ConfigProvider.getSocialLoginConfig(), []);

  const { loginByApple, loginByGoogle } = useSocialLogin({ socialLogin });

  const [{ networkType, chainType }] = usePortkey();

  const handlerParam = useMemo(
    () => ({
      defaultChainId,
      onError: onErrorRef.current,
      onSuccess,
      customValidateEmail: validateEmailRef.current,
      customValidatePhone: validatePhoneRef.current,
      onChainIdChange: onChainIdChangeRef.current,
    }),
    [defaultChainId, onSuccess],
  );
  const { validateEmail, validatePhone, onFinish, onSocialFinish } = useSignHandler(handlerParam);

  const onAccountTypeChange = useCallback(
    async (type: AccountType | 'Scan') => {
      try {
        if (type !== 'Apple' && type !== 'Google') return setAccountType(type);
        let result;
        if (type === 'Google') {
          setLoading(true);
          result = await loginByGoogle();
        } else if (type === 'Apple') {
          setLoading(true);
          result = await loginByApple();
        } else throw Error('AccountType is not support');
        await onSocialFinish(result);
      } catch (error) {
        setLoading(false);
        errorTip(
          {
            errorFields: 'onAccountTypeChange',
            error: handleErrorMessage(error),
          },
          isErrorTip,
          onErrorRef.current,
        );
      }
    },
    [isErrorTip, loginByApple, loginByGoogle, onSocialFinish],
  );

  return (
    <div className={clsx('portkey-ui-user-input-wrapper', className)} style={style}>
      {accountType === 'Scan' && (
        <ScanCard
          chainId={defaultChainId}
          backIcon={<CustomSvg type="PC" />}
          chainType={chainType}
          networkType={networkType}
          onBack={() => setAccountType(null)}
          onFinish={onLoginFinishWithoutPin}
          isErrorTip={isErrorTip}
          onError={onError}
        />
      )}
      {(accountType === 'Email' || accountType === 'Phone') && (
        <InputLogin
          type="Login"
          className="user-input-login"
          defaultAccountType={accountType}
          phoneCountry={phoneCountry}
          validateEmail={validateEmail}
          validatePhone={validatePhone}
          onFinish={onFinish}
          onBack={() => setAccountType(null)}
        />
      )}

      {!accountType && (
        <Overview
          isShowScan={showScan}
          extraElement={extraElement}
          onAccountTypeChange={onAccountTypeChange}
          termsOfService={termsOfService}
        />
      )}
    </div>
  );
}

export default memo(UserInput);
