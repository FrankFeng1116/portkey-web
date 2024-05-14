import { Input } from 'antd';
import { useState } from 'react';
import SuffixSelect from '../SuffixSelect';
import { RampDrawerType, IKeyDownParams, PartialFiatType, FiatType } from '../../../../types';
import CustomSvg from '../../../CustomSvg';
import { countryCodeMap } from '../../../../constants/ramp';

export interface ICurrencyInputProps {
  value: string;
  fiatList: FiatType[];
  onChange: (val: string) => void;
  readOnly: boolean;
  onKeyDown: (e: IKeyDownParams) => void;
  curFiat: PartialFiatType;
  onSelect: (v: PartialFiatType) => void;
}

export default function CurrencyInput({
  value,
  fiatList,
  onChange,
  readOnly,
  onKeyDown,
  curFiat,
  onSelect,
}: ICurrencyInputProps) {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  return (
    <>
      <Input
        value={value}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        onKeyDown={onKeyDown}
        suffix={
          <div className="portkey-ui-flex-center" onClick={() => setOpenDrawer(true)}>
            <div className="img">
              <img src={countryCodeMap[curFiat.country || '']?.icon} alt="" />
            </div>
            <div className="currency">{curFiat.currency}</div>
            <CustomSvg type="Down" />
          </div>
        }
      />
      <SuffixSelect
        drawerType={RampDrawerType.CURRENCY}
        fiatList={fiatList}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onSelect={onSelect}
      />
    </>
  );
}
