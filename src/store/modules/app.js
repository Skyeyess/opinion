import content from '../../constants/content';
export default {
	state: {
		navList: [{
			id: 'hna',
			name: 'common.hna',
			route: 'hna',
			alt: 'hna',
			redPoint: false,
			selectedImg: `${content.prototype.imgBase}hna.png`,
			selectImg: `${content.prototype.imgBase}hna-o.png`
		}, {
			id: 'opinion',
			name: 'common.opinion',
			route: 'opinion',
			alt: 'opinion',
			redPoint: true,
			selectedImg: `${content.prototype.imgBase}opinion.png`,
			selectImg: `${content.prototype.imgBase}opinion-o.png`
		}, {
			id: 'insight',
			name: 'common.insight',
			route: 'insight',
			alt: 'insight',
			redPoint: false,
			selectedImg: `${content.prototype.imgBase}insight.png`,
			selectImg: `${content.prototype.imgBase}insight-o.png`
		}, {
			id: 'index',
			name: 'common.index',
			route: 'index',
			alt: 'news',
			redPoint: false,
			selectedImg: `${content.prototype.imgBase}news.png`,
			selectImg: `${content.prototype.imgBase}news-o.png`
		}],
		backList: ['detail', 'wordDetail', 'share', 'search', 'login', 'madeKeywords', 'addKeywords', 'chartDetail', 'comment', 'commentDetail',
			'hotTopicList', 'maintain', 'profile', 'recommend', 'myComment', 'language', 'setting', 'collection', 'switches', 'about', 'message', 'insightDetails', 'hnaNewsList'],
		scrollEle: [['hna-main'], ['summary-news', 'daily-news', 'sensitive-main', 'special-main'], ['insight-main'], ['index-main']]
	}
};
