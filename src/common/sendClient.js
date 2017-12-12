export default (sendData) => {
    console.log(sendData)
    if (window.webkit && window.webkit.messageHandlers) {
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {  // 判断iPhone|iPad|iPod|iOS
            if (sendData.type === 'share' && localStorage.loginType && localStorage.loginType === 'bim') {
                window.webkit.messageHandlers.clientShare.postMessage(sendData);
            } else {
                window.webkit.messageHandlers.senderModel.postMessage(sendData);
            }
        }
    }
    if (window.messageHandlers) {
        if (/(Android)/i.test(navigator.userAgent)) {   // 判断Android
            if (sendData.type === 'share' && localStorage.loginType && localStorage.loginType === 'bim') {
                window.messageHandlers.clientShare(JSON.stringify(sendData));
            } else {
                window.messageHandlers.postMessage(JSON.stringify(sendData));
            }
        }
    }
};
