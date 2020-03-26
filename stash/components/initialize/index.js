import s from './style.scss';

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from 'coding-ui-kit/button';
import Alert from 'coding-ui-kit/alert';

import { MAINTENANCE } from 'share/rest-api-error-code';
import EmptyHolder from 'share/common/EmptyHolder';
import Loading from 'share/common/loading';
import { loadStatisticInit, postStatisticInit } from 'share/module/project/statistic/action';

import RefreshContainer from '../refresh-container/index';

import {
    EnterprisePermissionInterceptor,
    EnterprisePermissionFunction,
    EnterprisePermissionAction,
} from '@coding/e-share/common/enterprise-permission';

const updatePerm = [
    {
        function: EnterprisePermissionFunction.ENTERPRISE_STATISTIC,
        action: EnterprisePermissionAction.UPDATE,
    },
];

class Initialize extends Component {
    static propTypes = {
        teamId: PropTypes.number,
        projectId: PropTypes.number,
        children: PropTypes.any,
        initialize: PropTypes.object,
        showLoading: PropTypes.bool,
        showRefresh: PropTypes.bool,
        loadInit: PropTypes.func.isRequired,
        postInit: PropTypes.func.isRequired,
    };

    static defaultProps = {
        showLoading: true,
        showRefresh: true,
    };

    state = {
        loading: true,
        posting: false,
        inTheMaintenance: false,
    };

    timer = null;

    componentDidMount() {
        this.load();
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
        this.unmounted = true;
    }

    load = () => {
        clearTimeout(this.timer);
        const { loadInit, teamId, projectId } = this.props;
        if (teamId) {
            loadInit(teamId, projectId)
                .then(({ status }) => {
                    if (status === 0) {
                        this.timer = setTimeout(this.load, 5000);
                    }
                })
                .catch(res => {
                    if (res.code === MAINTENANCE.IN_THE_MAINTENANCE) {
                        this.setState({
                            inTheMaintenance: true,
                        });
                    }
                })
                .finally(() => {
                    if (!this.unmounted) {
                        this.setState({ loading: false });
                    }
                });
        }
    };

    init = () => {
        const { postInit, teamId, projectId } = this.props;
        this.setState({ posting: true });
        postInit(teamId, projectId)
            .then(() => this.load())
            .finally(() => this.setState({ posting: false }));
    };

    render() {
        const { initialize, children, showLoading, showRefresh } = this.props;
        const { loading, posting } = this.state;
        const { status, percent, total } = initialize || {};
        if (loading) {
            return showLoading ? (
                <EmptyHolder icon={EmptyHolder.ICONS.TaskStatistics}>
                    <Loading show={loading} text="加载数据中..." />
                </EmptyHolder>
            ) : (
                <div className={s.initContainer}>{children}</div>
            );
        }
        if (!initialize || (status === 0 && total === 0)) {
            return (
                <div style={{ height: '100%' }}>
                    {this.state.inTheMaintenance && (
                        <Alert
                            type={'warning'}
                            style={{ marginBottom: 15, marginTop: -15, textAlign: 'left' }}
                        >
                            统计功能维护中，工程师正在努力修复。
                        </Alert>
                    )}
                    <div
                        style={{
                            height: this.state.inTheMaintenance ? 'calc(100% - 100px)' : '100%',
                        }}
                    >
                        <EmptyHolder icon={EmptyHolder.ICONS.TaskStatistics}>
                            <div className={s.initContainer}>
                                <div className={s.title}>欢迎使用统计功能</div>
                                <div className={s.intro}>
                                    统计通过数字和图表的方式对项目状态进行统计，方便直观的了解项目情况
                                    <br />
                                    点击「初始化统计」马上开启统计功能
                                </div>
                                <EnterprisePermissionInterceptor
                                    by={updatePerm}
                                    previousPermissible={true}
                                    noPermissibleRender={() => (
                                        <Button size="large" loading={posting} disabled={true}>
                                            初始化统计
                                        </Button>
                                    )}
                                >
                                    <Button
                                        disabled={posting}
                                        loading={posting}
                                        size="large"
                                        onClick={this.init}
                                    >
                                        初始化统计
                                    </Button>
                                </EnterprisePermissionInterceptor>
                            </div>
                        </EmptyHolder>
                    </div>
                </div>
            );
        }
        if (status === 0 && total > 0) {
            return (
                <EmptyHolder icon={EmptyHolder.ICONS.TaskStatistics}>
                    统计初始化已完成 {percent}
                    %，请耐心等候...
                </EmptyHolder>
            );
        }
        return (
            <div className={s.initContainer}>
                {showRefresh && <RefreshContainer />}
                {children}
            </div>
        );
    }
}

export default connect(
    ({ APP: { enterprise, currentProject }, STAT: { initialize } }) => {
        const { id: teamId } = enterprise || {};
        const { id: projectId } = currentProject || {};
        return {
            teamId,
            projectId,
            initialize,
        };
    },
    dispatch => ({
        loadInit: (teamId, projectId) => dispatch(loadStatisticInit(teamId, projectId)),
        postInit: (teamId, projectId) => dispatch(postStatisticInit(teamId, projectId)),
    })
)(Initialize);
