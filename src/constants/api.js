export default {
    // iam登录登出
    login: 'https://login.hnagroup.com/ngiam-rst/cas/login',
    logout: 'https://iam.hnagroup.com/ngiam-rst/cas/logout',
    // 图片地址
    imagePath: 'http://192.168.100.193:8083',
    insightImgPath: 'http://223.202.32.54:8070',
    // baseurl
    common_baseUrl: '/hnaData/api/v3',
    auth_baseUrl: '/hnaData/api/v2',
    // 日志
    log: '/userlog',
    // 登录
    auth: '/auth',
    // 海航
    hna_news: '/records/opinions/findHnaNews',
    // 舆情报告
    report_info: '/report/news/dataReport',
    report_unread: '/notificate/query',
    report_read: '/notificate/updateLog',
    opinion_info: '/report/news/overview',
    opinion_line: '/report/news/mediaVolume',
    opinion_bar: '/report/news/companyTransmissionVolume',
    opinion_pie: '/report/news/analysisMedia',
    opinion_hollow: '/report/news/typeTransmissionVolume',
    opinion_radar: '/report/news/culturalTransmissionVolume',
    opinion_word: '/report/news/cloud',
    opinion_news: '/records/opinions/findImportantNews',
    opinion_comment: '/remark',
    opinion_detail: '/records/opinions/findOpinionsDetail',
    // 舆情速览
    summary_company: '/records/opinions/findCompanyByGroupId',
    // 敏感舆情
    screen_special: '/custom',
    keyword_detail: '/custom/info',
    sensitive_news: '/records/opinions/custom/findlist',
    // 专项定制
    special_info: '/report/news/customReportForTopic',
    special_news: '/report/reportInside/custom/graphInside',
    special_line: '/report/news/mediaVolumeForTopic',
    special_pie: '/report/news/analysisMediaForTopic',
    special_hollow: '/report/news/typeTransmissionVolumeForTopic',
    // 洞见
    insight: '/hnafile',
    insightTag: '/hnafile/getAllHnaType',
    // 资讯
    home_news: '/records/news',
    home_search: '/records/news/search',
    news_detail: '/records/news/detail',
    about_info: '/records/news/findRelNews',
    // 热点话题
    hot_graph: '/hottopic/findRelTopic',
    hot_wordcloud: '/hottopic',
    hot_charts: '/hottopic/findChartByTopicid',
    hot_news: '/hottopic/findNewsByTopicid',
    // 订阅
    getTags: '/industry',
    addTag: '/industry/addSubscribe',
    deleteTag: '/industry/delSubscribe',
    // 收藏
    hnaCollect: '/hnacollect',
    hnaIsCollect: '/hnacollect/findByEmpIdAndArticleId',
    cancelHnaCollect: '/hnacollect/cancelCollect',
    getCollcetion: '/hnacollect/getDetailById',
    // 个人中心
    profile: '/employee/info',
    rolesArr: '/employee/roleList',
    getVersion: '/h5version/getLatestVersion',
    readed_all: '/notificate/updateAllRead',
    // 推送消息
    delete_message: 'notificate',
    messgae_detail: 'notificate/detail',
    message_list: '/notificate/select',
    message_noRead: '/notificate/count',
    message_Readed: '/notificate/update',
    switch_message: '/notificate/switch',
    get_switches: '/notificate/user',
    // 搜索
    search_chart: '/report/news/cloudWord',
    search_all: '/records/news/searchAll',
    search_news: '/report/reportInside/graphInside',
    // 评论
    comment: '/comment',
    comment_hot: '/comment/findLikeSort',
    comment_get: '/comment/findByTargetId',
    my_comment: 'comment/findMyComment',
    comment_reply: '/comment/findByCommonId',
    comment_count: '/commentcount/count',
    // 点赞
    like_state: '/commentlike/islike',
    like_add: '/commentlike/like',
    like_del: '/commentlike/cancellike',
    // 投诉
    report_type: '/dataconfig/REPORT_TYPE',
    report_is: '/commentreport/isReport',
    report_comment: '/commentreport',
    // 详情图表
    detail_trend: '/report/opinions/findMediaById',
    detail_hollow: '/report/opinions/findMediaPieById'
}
