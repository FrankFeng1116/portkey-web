import CheckCircleOutlinedIcon from '@ant-design/icons/CheckCircleOutlined';
import CloseCircleOutlinedIcon from '@ant-design/icons/CloseCircleOutlined';
import ExclamationCircleOutlinedIcon from '@ant-design/icons/ExclamationCircleOutlined';
import InfoCircleOutlinedIcon from '@ant-design/icons/InfoCircleOutlined';
import { render as reactRender, unmount as reactUnmount } from 'rc-util/lib/React/render';
import ConfirmDialog from './ConfirmDialog';
import destroyFns from '../../utils/destroyFns';
import { getConfirmLocale } from './locale';
import type { ModalFuncProps } from 'antd';
import { PORTKEY_ICON_PREFIX_CLS, PORTKEY_PREFIX_CLS } from '../../../../constants';

const CheckCircleOutlined = (CheckCircleOutlinedIcon as any).default || CheckCircleOutlinedIcon;
const CloseCircleOutlined = (CloseCircleOutlinedIcon as any).default || CloseCircleOutlinedIcon;

const ExclamationCircleOutlined = (ExclamationCircleOutlinedIcon as any).default || ExclamationCircleOutlinedIcon;

const InfoCircleOutlined = (InfoCircleOutlinedIcon as any).default || InfoCircleOutlinedIcon;

type ConfigUpdate = ModalFuncProps | ((prevConfig: ModalFuncProps) => ModalFuncProps);

export type ModalFunc = (props: ModalFuncProps) => {
  destroy: () => void;
  update: (configUpdate: ConfigUpdate) => void;
};

export type ModalStaticFunctions = Record<NonNullable<ModalFuncProps['type']>, ModalFunc>;

export default function confirm(config: ModalFuncProps) {
  const container = document.createDocumentFragment();
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  let currentConfig = { ...config, close, open: true } as any;
  let timeoutId: NodeJS.Timeout;

  function destroy(...args: any[]) {
    const triggerCancel = args.some((param) => param && param.triggerCancel);
    if (config.onCancel && triggerCancel) {
      config.onCancel(() => {
        //
      }, ...args.slice(1));
    }
    for (let i = 0; i < destroyFns.length; i++) {
      const fn = destroyFns[i];
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      if (fn === close) {
        destroyFns.splice(i, 1);
        break;
      }
    }

    reactUnmount(container);
  }

  function render({ okText, cancelText, prefixCls: customizePrefixCls, ...props }: any) {
    clearTimeout(timeoutId);

    /**
     * https://github.com/ant-design/ant-design/issues/23623
     *
     * Sync render blocks React event. Let's make this async.
     */
    timeoutId = setTimeout(() => {
      const runtimeLocale = getConfirmLocale();
      // because Modal.config  set rootPrefixCls, which is different from other components
      const rootPrefixCls = PORTKEY_PREFIX_CLS;
      const prefixCls = customizePrefixCls || `${rootPrefixCls}-modal`;
      const iconPrefixCls = PORTKEY_ICON_PREFIX_CLS;

      reactRender(
        <ConfirmDialog
          {...props}
          prefixCls={prefixCls}
          rootPrefixCls={rootPrefixCls}
          iconPrefixCls={iconPrefixCls}
          okText={okText || (props.okCancel ? runtimeLocale.okText : runtimeLocale.justOkText)}
          cancelText={cancelText || runtimeLocale.cancelText}
        />,
        container,
      );
    });
  }

  function close(...args: any[]) {
    currentConfig = {
      ...currentConfig,
      open: false,
      afterClose: () => {
        if (typeof config.afterClose === 'function') {
          config.afterClose();
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        destroy.apply(this, args);
      },
    };

    // Legacy support
    if (currentConfig.visible) {
      delete currentConfig.visible;
    }

    render(currentConfig);
  }

  function update(configUpdate: ConfigUpdate) {
    if (typeof configUpdate === 'function') {
      currentConfig = configUpdate(currentConfig);
    } else {
      currentConfig = {
        ...currentConfig,
        ...configUpdate,
      };
    }
    render(currentConfig);
  }

  render(currentConfig);

  destroyFns.push(close);

  return {
    destroy: close,
    update,
  };
}

export function withWarn(props: ModalFuncProps): ModalFuncProps {
  return {
    icon: <ExclamationCircleOutlined />,
    okCancel: false,
    ...props,
    type: 'warning',
  };
}

export function withInfo(props: ModalFuncProps): ModalFuncProps {
  return {
    icon: <InfoCircleOutlined />,
    okCancel: false,
    ...props,
    type: 'info',
  };
}

export function withSuccess(props: ModalFuncProps): ModalFuncProps {
  return {
    icon: <CheckCircleOutlined />,
    okCancel: false,
    ...props,
    type: 'success',
  };
}

export function withError(props: ModalFuncProps): ModalFuncProps {
  return {
    icon: <CloseCircleOutlined />,
    okCancel: false,
    ...props,
    type: 'error',
  };
}

export function withConfirm(props: ModalFuncProps): ModalFuncProps {
  return {
    icon: <ExclamationCircleOutlined />,
    okCancel: true,
    ...props,
    type: 'confirm',
  };
}
