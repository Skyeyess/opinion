export default (type, formData) => {
    let data = formData || {};
    switch (type) {
        case 'refresh': // 刷新时
            data = {
                list: data.list || [],
                total: data.total || 0,
                page: 1,
                end: false,
                next: false,
                none: false,
                error: false,
                status: false,
                loading: false,
                refresh: true
            };
            break;
        case 'next': // 翻页时
            data = {
                list: data.list || [],
                total: data.total || 0,
                page: (data.page + 1) || 1,
                end: false,
                next: true,
                none: false,
                error: false,
                status: false,
                loading: false,
                refresh: false
            };
            break;
        case 'error':  // 报错时
            if (data.page === 1) {
                data.loading = false;
                data.status = true;
                data.error = true;
            } else {
                data.page -= 1;
            }
            break;
        case 'first': // 第一次加载时
        default:
            data = {
                list: [],
                total: 0,
                page: 1,
                end: false,
                next: false,
                none: false,
                error: false,
                status: true,
                loading: true,
                refresh: false
            };
            break;
    }
    return data;
};
