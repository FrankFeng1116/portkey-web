import { Checkbox, Input } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { parseInputNumberChange } from '../../utils/input';
import BigNumber from 'bignumber.js';
import './index.less';
import { isValidNumber } from '../../utils';
import clsx from 'clsx';
import ThrottleButton from '../ThrottleButton';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

const PrefixCls = 'set-allowance';
export interface BaseSetAllowanceProps {
  symbol: string;
  decimals?: number;
  amount: number | string;
  className?: string;
  max?: string | number;
  dappInfo?: { icon?: string; href?: string; name?: string };
}

export interface IAllowance {
  allowance: string;
  useAllToken?: boolean;
}

export interface SetAllowanceHandlerProps {
  onCancel?: () => void;
  onConfirm?: (res: IAllowance) => void;
  onAllowanceChange?: (amount: string) => void;
}

export type SetAllowanceProps = BaseSetAllowanceProps & {
  recommendedAmount?: string | number;
} & SetAllowanceHandlerProps;

export default function SetAllowanceMain({
  max = Infinity,
  amount,
  decimals,
  dappInfo,
  symbol,
  className,
  recommendedAmount = 0,
  onCancel,
  onAllowanceChange,
  onConfirm,
}: SetAllowanceProps) {
  const formatAllowanceInput = useCallback(
    (value: number | string) =>
      parseInputNumberChange(value.toString(), max ? new BigNumber(max) : undefined, decimals),
    [decimals, max],
  );

  const allowance = useMemo(() => formatAllowanceInput(amount), [amount, formatAllowanceInput]);

  const [error, setError] = useState<string>('');

  const [useAllToken, setUseAllToken] = useState<boolean>(false);

  const inputChange = useCallback(
    (amount: string | number) => {
      if (isValidNumber(`${amount}`)) {
        onAllowanceChange?.(formatAllowanceInput(amount));
      } else if (!amount) {
        onAllowanceChange?.('');
      }
      setError('');
    },
    [formatAllowanceInput, onAllowanceChange],
  );

  const onAllowAllTokenChange = useCallback(
    (e: CheckboxChangeEvent) => {
      setUseAllToken(!!e.target.checked);
    },
    [setUseAllToken],
  );

  return (
    <div className={clsx(`${PrefixCls}-wrapper`, className)}>
      <div className={clsx('portkey-ui-flex-center', `${PrefixCls}-dapp-info`)}>
        {(dappInfo?.href || dappInfo?.icon) && (
          <div className={`${PrefixCls}-dapp-info-inner`}>
            {dappInfo.icon && <img className={`${PrefixCls}-dapp-icon`} src={dappInfo.icon} />}
            {dappInfo.href && <span className={`${PrefixCls}-dapp-href`}>{dappInfo.href}</span>}
          </div>
        )}
      </div>
      <div className={`${PrefixCls}-header`}>
        <h1 className={`portkey-ui-text-center ${PrefixCls}-title`}>{`Request for access to your ${symbol}`}</h1>
        <div className={`portkey-ui-text-center ${PrefixCls}-description`}>
          To keep your funds safe, please set a token allowance for the contract. Without an allowance or with
          insufficient allowance, some process may be stuck
        </div>
      </div>

      <div className={`${PrefixCls}-body`}>
        <div className={`portkey-ui-flex-between-center ${PrefixCls}-body-title`}>
          <span className={`${PrefixCls}-set`}>{`Set Allowance`}</span>
          <span className={`${PrefixCls}-use-recommended`} onClick={() => inputChange(recommendedAmount)}>
            Use Recommended Value
          </span>
        </div>
        <div className={`${PrefixCls}-input-wrapper`}>
          <Input
            value={allowance}
            onChange={(e) => {
              inputChange(e.target.value);
            }}
            suffix={<span onClick={() => inputChange(max)}>Max</span>}
          />
          {typeof error !== 'undefined' && <div className="error-text">{error}</div>}
        </div>
        <div className={`${PrefixCls}-confirm-line`}>
          <Checkbox className={`${PrefixCls}-confirm-line-checkbox`} onChange={onAllowAllTokenChange} />
          <div className={`${PrefixCls}-confirm-line-text`}>Approve other token at same time</div>
        </div>
        <div className={`${PrefixCls}-notice`}>
          Just input a single number that you consider a reasonable current or future contract expenditure, and you can
          always increase the spending limit later.
        </div>
      </div>
      <div className="portkey-ui-flex-1 portkey-ui-flex-column-reverse">
        <div className="btn-wrapper">
          <ThrottleButton onClick={onCancel}>Reject</ThrottleButton>
          <ThrottleButton
            type="primary"
            disabled={BigNumber(allowance).isNaN()}
            onClick={() => {
              if (!isValidNumber(allowance)) return setError('Please enter a positive whole number');
              if (BigNumber(allowance).lte(0)) return setError('Please enter a non-zero value');
              onConfirm?.({ allowance, useAllToken });
            }}>
            Pre-authorize
          </ThrottleButton>
        </div>
      </div>
    </div>
  );
}
