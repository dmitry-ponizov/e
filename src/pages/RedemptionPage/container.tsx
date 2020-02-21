import React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import RedemptionPageLayout from 'pages/RedemptionPage/layout';
import enhance from 'helpers/enhance';
import {IRootStore} from 'stores';
import {withTranslation, WithTranslation} from 'react-i18next';

interface IInjectedProps {

}

interface IState {

}

@inject((rootStore: IRootStore): IInjectedProps => ({

}))
@observer
class RedemptionPageContainer extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation, IState> {
  render() {
    return (
      <RedemptionPageLayout
        t={this.props.t}
      />
    );
  }
}

const RedemptionPage = enhance(RedemptionPageContainer, [withRouter, withTranslation()]);
export default RedemptionPage;
