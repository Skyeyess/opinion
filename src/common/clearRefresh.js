export default (that, refName) => {
    // that.getEleHeight();
    var popupArr = document.querySelectorAll('.mint-popup');
    for (let i = 0; i < popupArr.length; i++) {
        popupArr[i].addEventListener('touchmove', (e) => {
            if (e.cancelable && !e.defaultPrevented) {
                e.preventDefault();
            }
        });
    }

    // const topLoad = function() {
    //     const refreshEle = document.querySelector('.mint-loadmore-top');
    //     if (refreshEle) {
    //         refreshEle.style.backgroundImage = '';
    //     }
    //     Object.keys(that.$refs).forEach(refName => {
    //         if (that.$refs[refName].onTopLoaded) {
    //             that.$refs[refName].onTopLoaded();
    //         }
    //     });
    // }
    // if (sessionStorage.refreshTime && new Date().getTime() - sessionStorage.refreshTime < that.refreshInterval) {
    //     setTimeout(function () {
    //         topLoad();
    //     }, that.refreshInterval - (new Date().getTime() - sessionStorage.refreshTime))
    // } else {
    //     topLoad();
    // }
}
