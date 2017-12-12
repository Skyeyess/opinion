import constants from '../constants/content'
/**
 * 调用countly的API去追踪数据
 */
export default (current, router) => {
// 登陆之后才统计行为，未登录用户不统计
	if (!current.userName) {
		return;
    }
	// 加上用户的统计，统计哪个用户访问的哪个页面
    // track sessions automatically
    Countly.track_sessions();
    // track pageviews automatically
    Countly.track_pageview(router.meta.pageTitle || constants.OTHER);
    Countly.add_event({
		key: current.userName,
		segmentation: {
			page: router.meta.pageTitle || constants.OTHER
		}
	});
    // track any clicks to webpages automatically
    Countly.track_clicks();
    // track link clicks automatically
    Countly.track_links();
    // track form submissions automatically
    Countly.track_forms();
    // track javascript errors
//    Countly.track_errors({jquery:"1.10", jqueryui:"1.10"});
}
