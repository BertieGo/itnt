import { injectAsyncReducer } from 'share/store';
import { injectAsyncI18n } from 'enterprise/common/i18n';
import wrapper from 'enterprise/common/wrappers/commonWrapper';
import { enterpriseUsageIsVaild, constructEnterpriseTitle } from 'enterprise/common/utils';
import onEnter from 'enterprise/module/admin/route-permission-interceptor';

export const indexRoute = {
    getComponent(location, callback) {
        require.ensure([], () => {
            injectAsyncReducer('STAT', require('share/module/project/statistic/reducer').default);
            injectAsyncI18n('OVERVIEW', require('./i18n.json'));
            callback(null, require('../test/overview/container').default);
        });
    },
};

export default {
    path: 'overview',
    documentTitle: constructEnterpriseTitle('团队概览'),
    component: enterpriseUsageIsVaild(wrapper),
    indexRoute,
    onEnter,
};
