import { CreateWalletType } from '../types';
import CommonModal from '../CommonModal';
import './index.less';
import ThrottleButton from '../ThrottleButton';

export default function LoginModal({
  open,
  type = 'Login',
  maskClosable = false,
  onCancel,
  onConfirm,
}: {
  open?: boolean;
  type?: CreateWalletType;
  maskClosable?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
}) {
  return (
    <CommonModal
      maskClosable={maskClosable}
      closable={false}
      open={open}
      width={320}
      title={'Continue with this account?'}
      type={'modal'}
      className="portkey-ui-signup-confirm-modal"
      onClose={onCancel}>
      <p className="modal-content">
        {type === 'Login' && 'This account has not been registered yet. Click "Confirm" to complete the registration.'}
        {type === 'SignUp' && 'This account already exists. Click "Confirm" to log in.'}
      </p>
      <div className="btn-wrapper">
        <ThrottleButton onClick={onCancel}>Cancel</ThrottleButton>
        <ThrottleButton type="primary" onClick={onConfirm}>
          Confirm
        </ThrottleButton>
      </div>
    </CommonModal>
  );
}
