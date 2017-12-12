export default (eleName, styleName) => { // 获取元素最大高度
    let ele = document.querySelector(eleName || '.news-list');
    if (ele) {
        const first = ele;
        let top = ele.offsetTop;
        const tabBar = document.querySelector('.mint-tabbar.bottom_tabs') || document.querySelector('.comment-box');
        const tabBarHeight = tabBar ? tabBar.offsetHeight : 0;
        while (ele.offsetParent) {
            ele = ele.offsetParent;
            top += ele.offsetTop;
        }
        first.style[styleName || 'min-height'] = `${document.body.clientHeight - top - tabBarHeight}px`;
        return document.body.clientHeight - top - tabBarHeight;
    }
}
