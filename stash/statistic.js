import React from 'react';

import EnterpriseWorkTrend from 'share/module/project/statistic/component/enterprise-work-trend';
import EnterpriseProjectProgress from 'share/module/project/statistic/component/enterprise-project-progress';
import EnterpriseMemberFinishedTask from 'share/module/project/statistic/component/enterprise-member-finished-task';
import EnterpriseTotal from 'share/module/project/statistic/component/enterprise-total';
import EnabledTask from 'share/module/project/statistic/component/enabled-task';

import StatisticInitialize from './components/initialize/index';

const EnterpriseStatistic = () => (
    <StatisticInitialize>
        <EnterpriseTotal />
        <EnterpriseWorkTrend />
        <EnabledTask>
            <EnterpriseProjectProgress />
        </EnabledTask>
        <EnabledTask>
            <EnterpriseMemberFinishedTask />
        </EnabledTask>
    </StatisticInitialize>
);

export default EnterpriseStatistic;
