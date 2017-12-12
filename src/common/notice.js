import i18n from '../language';
import { Toast } from 'mint-ui';

export default (state, message, duration) => {
    Toast({
        message: i18n.t(message),
        iconClass: state === 'success' ? 'iconfont icon-roundcheck' : 'iconfont icon-roundclose',
        duration: duration || 1000
    });
};
