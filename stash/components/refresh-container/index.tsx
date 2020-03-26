import s from './style.scss';

import moment from 'moment';

import React from 'react';
import { connect } from 'react-redux';
import Button from 'coding-ui-kit/button';

import { refreshStatistic } from 'share/module/project/statistic/action';

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

interface IInitialize {
    status: number;
    percent: number;
    teamId: number;
    projectId: number;
    deadline: string;
}

interface IRefreshContainerStore {
    STAT: {
        initialize?: IInitialize;
    };
}

interface IRefreshContainerAction {
    doRefresh: (teamId: number, projectId: number) => {};
}

interface IRefreshContainerProps {
    initialize?: IInitialize;
    doRefresh: (teamId: number, projectId: number) => {};
}

const mapStateToProps = ({ STAT: { initialize } }: IRefreshContainerStore) =>
    ({
        initialize,
    } as IRefreshContainerProps);

const mapActionToProps = (dispatch: any) =>
    ({
        doRefresh: (teamId, projectId) => dispatch(refreshStatistic(teamId, projectId)),
    } as IRefreshContainerAction);

class RefreshContainer extends React.Component<IRefreshContainerProps, {}> {
    private refresh = () => {
        const { initialize } = this.props;
        if (!initialize) {
            return;
        }
        const { teamId, projectId } = initialize;
        this.props.doRefresh(teamId, projectId || 0);
    };

    public render() {
        const { initialize } = this.props;
        if (!initialize) {
            return null;
        }
        const { deadline } = initialize;
        if (!deadline) {
            return null;
        }
        return (
            <div className={s.refreshContainer}>
                <div className={s.time}>
                    当前数据统计截止 {moment(deadline).format('YYYY-MM-DD HH:mm')}
                </div>
                <div className={s.btn}>
                    <EnterprisePermissionInterceptor
                        by={updatePerm}
                        previousPermissible={true}
                        noPermissibleRender={() => (
                            <Button size="small" disabled={true}>
                                刷新
                            </Button>
                        )}
                    >
                        <Button size="small" onClick={this.refresh}>
                            刷新
                        </Button>
                    </EnterprisePermissionInterceptor>
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapActionToProps
)(RefreshContainer);
