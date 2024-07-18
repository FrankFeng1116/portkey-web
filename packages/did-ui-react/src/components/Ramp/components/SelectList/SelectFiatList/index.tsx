import { ReactNode, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IRampCryptoDefault, IRampFiatItem } from '@portkey/ramp';
import CustomSvg from '../../../../CustomSvg';
import DropdownSearch from '../../../../DropdownSearch';
import '../index.less';

export interface ISelectFiatListProps {
  supportList: IRampFiatItem[];
  defaultCrypto: IRampCryptoDefault;
  title?: ReactNode;
  searchPlaceHolder?: string;
  onClose?: () => void;
  onChange?: (v: IRampFiatItem) => void;
}

export default function SelectFiatList({
  supportList,
  title,
  searchPlaceHolder,
  onClose,
  onChange,
}: ISelectFiatListProps) {
  const { t } = useTranslation();
  const [openDrop, setOpenDrop] = useState<boolean>(false);
  const [filterWord, setFilterWord] = useState<string>('');

  const showFiatList = useMemo(() => {
    return filterWord === ''
      ? supportList
      : supportList.filter(
          (item) =>
            item.symbol.toLowerCase().includes(filterWord.toLowerCase()) ||
            item.countryName?.toLowerCase().includes(filterWord.toLowerCase()),
        );
  }, [filterWord, supportList]);

  useEffect(() => {
    setOpenDrop(!!filterWord && !showFiatList.length);
  }, [filterWord, showFiatList]);

  const renderFiatList = useMemo(
    () => (
      <>
        {showFiatList.map((fiat) => (
          <div
            key={`${fiat.country}_${fiat.symbol}`}
            className="item fiat-item portkey-ui-flex"
            onClick={() => {
              onChange?.(fiat);
              onClose?.();
            }}>
            <div className="flag">
              <img src={fiat.icon || ''} alt="" />
            </div>
            <div className="text">{`${fiat.countryName || ''} - ${fiat.symbol}`}</div>
          </div>
        ))}
      </>
    ),
    [onChange, onClose, showFiatList],
  );

  return (
    <div className="custom-list">
      <div className="header">
        <p>{title || 'Select'}</p>
        <CustomSvg type="Close2" onClick={onClose} />
      </div>
      <DropdownSearch
        overlayClassName="empty-dropdown"
        open={openDrop}
        value={filterWord}
        overlay={<div className="empty-tip">{t('There is no search result.')}</div>}
        inputProps={{
          onBlur: () => setOpenDrop(false),
          onChange: (e) => {
            const _value = e.target.value.replaceAll(' ', '');
            if (!_value) setOpenDrop(false);
            setFilterWord(_value);
          },
          placeholder: searchPlaceHolder || 'Search',
        }}
      />
      <div className="list">{renderFiatList}</div>
    </div>
  );
}
