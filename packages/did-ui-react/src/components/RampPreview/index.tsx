import { ChainId } from '@portkey/types';
import { TRampPreviewInitState } from '../../types';
import PortkeyStyleProvider from '../PortkeyStyleProvider';
import RampPreviewMain from './index.component';

export interface IRampPreviewProps {
  className?: string;
  initState: TRampPreviewInitState;
  chainId?: ChainId;
  isMainnet: boolean;
  isBuySectionShow?: boolean;
  isSellSectionShow?: boolean;
  onBack: (state?: TRampPreviewInitState) => void;
}

export default function Ramp(props: IRampPreviewProps) {
  return (
    <PortkeyStyleProvider>
      <RampPreviewMain {...props} />
    </PortkeyStyleProvider>
  );
}
