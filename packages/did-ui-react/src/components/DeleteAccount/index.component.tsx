import { Button } from 'antd';
import './index.less';
import CustomSvg from '../CustomSvg';
import BackHeaderForPage from '../BackHeaderForPage';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import { useEffectOnce } from 'react-use';
import CustomModal from '../CustomModal';
import { singleMessage } from '../CustomAnt';
import { did, handleErrorMessage, parseAppleIdentityToken, setLoading, socialLoginAuth } from '../../utils';
import { usePortkeyAsset } from '../context/PortkeyAssetProvider';
import ConfigProvider from '../config-provider';
import { usePortkey } from '../context';
import { getGuardianList } from '../SignStep/utils/getGuardians';

export interface DeleteAccountProps {
  className?: string;
  onBack?: () => void;
  onDelete?: () => void;
}

const DeleteAccountConditions = {
  warning:
    'Please note that once you cancel your account, it cannot be recovered. Are you still want to proceed with the account cancellation?',
  explanation:
    'Account cancellation is a highly risky operation, and once canceled, it cannot be retrieved permanently. Please carefully confirm this again.',
  summary: 'Please note that the cancellation of the account requires the following conditions.',
  conditions: [
    {
      key: 1,
      label: 'Assets',
      content: 'Please transfer all of your assets out of your account, including Tokens and NFTs.',
    },
    {
      key: 2,
      label: 'Guardians',
      content: 'Please ensure that other users have already disassociated the Guardian from your current Apple ID.',
    },
    {
      key: 3,
      label: 'Login Devices',
      content: 'Please remove other login devices.',
    },
  ],
  accountDetection: {
    title: 'Account Detection',
    content: {
      assets: 'There are still remaining assets in your account. Please transfer all assets out of your account.',
      guardians:
        'Your Apple ID has been used by other users to bind Guardian. Please release these binding relationships.',
      loginDevices: 'Your account has been logged in on another device. Please remove the other device.',
    },
    okText: 'Ok',
  },
};

export default function DeleteAccountMain({ className, onBack, onDelete }: DeleteAccountProps) {
  const [{ managementAccount, caHash, originChainId }] = usePortkeyAsset();
  const [{ networkType }] = usePortkey();
  const _socialLogin = useMemo(() => ConfigProvider.getSocialLoginConfig(), []);

  const deleteAccount = useCallback(async () => {
    if (!caHash || !managementAccount?.address) return;
    setLoading(true);
    let appleToken;
    try {
      const { Apple } = _socialLogin ?? {};
      let token;
      if (Apple?.customLoginHandler) {
        const result = await Apple.customLoginHandler();
        token = result.data?.accessToken || result.data?.token;
      } else {
        const result = await socialLoginAuth({
          type: 'Apple',
          clientId: Apple?.clientId,
          redirectURI: Apple?.redirectURI,
          network: networkType,
        });
        token = result.token;
      }
      const userInfo = parseAppleIdentityToken(token);
      const guardianList = await getGuardianList({
        caHash: did.didWallet.aaInfo.accountInfo?.caHash || '',
        originChainId,
      });
      let isExist;
      guardianList.forEach((item) => {
        if (item.type === 'Apple' && item.identifier === userInfo?.userId) {
          isExist = true;
        }
      });
      if (!isExist) {
        setLoading(false);
        return singleMessage.error('Account does not match');
      }

      appleToken = token;
    } catch (error) {
      // error
    }
    if (!appleToken) return setLoading(false);

    try {
      await did.services.communityRecovery.deletionAccount({ appleToken });
    } catch (error) {
      console.log(error);
      const message = handleErrorMessage(error, 'deletion account error');
      singleMessage.error(message);
    } finally {
      did.logout({ chainId: originChainId });
      onDelete?.();
    }
  }, [_socialLogin, caHash, managementAccount?.address, networkType, onDelete, originChainId]);

  const AccountCancellationModal = useCallback(
    (pass?: boolean) => {
      CustomModal({
        type: 'confirm',
        okText: 'Continue',
        cancelText: 'Cancel',
        className: 'portkey-ui-account-cancellation-modal',
        content: (
          <div className="portkey-ui-flex-column">
            <div className="account-cancellation-modal-title">Warning</div>
            <div>{DeleteAccountConditions.warning}</div>
          </div>
        ),
        onOk: pass ? deleteAccount : undefined,
        onCancel: pass ? undefined : onBack,
      });
    },
    [onBack, deleteAccount],
  );

  const CheckDeleteResultModal = useCallback((list: string[]) => {
    CustomModal({
      content: (
        <>
          <div className="title">Unable to Delete Account</div>
          {list.map((tip, index) => (
            <div key={index}>
              {list.length > 1 ? `${index + 1}. ` : ''}
              {tip}
            </div>
          ))}
        </>
      ),
    });
  }, []);

  const onDeleteAccount = useCallback(async () => {
    if (!caHash) return; // || !managerAddress
    setLoading(true);
    try {
      // deletion check
      const req = await did.services.communityRecovery.checkDeletion();
      const { validatedAssets, validatedDevice, validatedGuardian } = req || {};
      const ruleList: string[] = [];
      if (!validatedAssets) ruleList.push(DeleteAccountConditions.accountDetection.content.assets);
      if (!validatedDevice) ruleList.push(DeleteAccountConditions.accountDetection.content.loginDevices);
      if (!validatedGuardian) ruleList.push(DeleteAccountConditions.accountDetection.content.guardians);
      if (ruleList.length > 0) {
        return CheckDeleteResultModal(ruleList);
      }
      AccountCancellationModal(true);
    } catch (error) {
      singleMessage.error(handleErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [AccountCancellationModal, CheckDeleteResultModal, caHash]);

  useEffectOnce(() => {
    // show alert after transition animation
    const timer = setTimeout(() => {
      AccountCancellationModal();
    }, 500);
    return () => clearTimeout(timer);
  });

  return (
    <div className={clsx('portkey-ui-delete-account', className)}>
      <div className="portkey-ui-flex-1">
        <BackHeaderForPage title="Account Cancelation" leftCallBack={onBack} />
        <div className="portkey-ui-flex-column-center portkey-ui-delete-account-body">
          <CustomSvg type="WarnRedBackground" style={{ width: 48, height: 48 }} />
          <div className="warning-tip">{DeleteAccountConditions.explanation}</div>
          <div className="conditions">
            <div className="conditions-summary">{DeleteAccountConditions.summary}</div>
            {DeleteAccountConditions.conditions.map((item) => {
              return (
                <div key={'DeleteAccountConditions_' + item.key + '_' + item.label} className="conditions-item">
                  <div className="conditions-item-label">{`${item.key}. ${item.label}`}</div>
                  <div className="conditions-item-value">{item.content}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="portkey-ui-delete-account-footer">
        <Button type="primary" onClick={onDeleteAccount}>
          Confirm
        </Button>
      </div>
    </div>
  );
}