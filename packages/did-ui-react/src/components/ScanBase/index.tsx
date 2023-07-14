import clsx from 'clsx';
import PortkeyQRCode from '../PortkeyQRCode';
import './index.less';
import ScanLoading from './components/ScanLoading';
import { GridType } from '../types';

interface ScanCardProps {
  isShowIcon?: boolean;
  gridType?: GridType;
  isWaitingAuth?: boolean;
  qrData?: string; // JSON.stringify(LoginQRData)
  backIcon?: React.ReactNode;
  wrapperClassName?: string;
  onBack?: () => void;
}

export default function ScanBase({
  qrData,
  backIcon,
  gridType = GridType.qrCodeOnTop,
  isWaitingAuth = false,
  isShowIcon = true,
  wrapperClassName,
  onBack,
}: ScanCardProps) {
  return (
    <div
      className={clsx(
        gridType ? 'portkey-ui-flex-column-reverse portkey-ui-justify-end' : 'portkey-ui-flex-column',
        'scan-card-wrapper',
        wrapperClassName,
      )}>
      <div className={clsx('scan-text-inner', gridType && 'scan-text-inner-reverse')}>
        <h2 className={clsx('font-medium scan-title')}>
          Scan code to log in
          {isShowIcon && backIcon && (
            <div className="back-icon-wrapper" onClick={onBack}>
              {backIcon}
            </div>
          )}
        </h2>
        <p className="description">Please use the portkey Dapp to scan the QR code</p>
      </div>

      <div className="scan-card-content">
        <div className="scan-content">{qrData && qrData !== '{}' && <PortkeyQRCode value={qrData} />}</div>
        {isWaitingAuth && (
          <div className="portkey-ui-flex-center waiting-wrapper">
            <ScanLoading />
            <p className="waiting-text">Waiting for authorization...</p>
          </div>
        )}
      </div>
    </div>
  );
}
