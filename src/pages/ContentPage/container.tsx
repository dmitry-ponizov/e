import React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import ContentPageLayout from './layout';
import enhance from 'helpers/enhance';
import {IRootStore} from 'stores';
import {withTranslation, WithTranslation} from 'react-i18next';

interface IInjectedProps {
  selectedContentItem: IContentItem | null;
  selectedContentItemDetails: IContentItemDetails | null;
  getContent: (params?: IPaginationRequestParams) => Promise<void>;
  clearErrors: () => void;
  getContentLoading: boolean;
  selectContentLoading: boolean;
}

interface IState {
  initiated: boolean;
}

@inject(
  (rootStore: IRootStore): IInjectedProps => ({
    selectedContentItem: rootStore.contentStore.selectedContentItem,
    selectedContentItemDetails: rootStore.contentStore.selectedContentItemDetails,
    getContent: rootStore.contentStore.getContent,
    clearErrors: rootStore.contentStore.clearErrors,
    getContentLoading: rootStore.contentStore.getContentLoading,
    selectContentLoading: rootStore.contentStore.selectContentLoading,
  }),
)
@observer
class ContentPageContainer extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = {initiated: false};
  }

  async componentDidMount() {
    await this.props.getContent({join: 'lastPublishedContent'});
    this.setState({initiated: true});
  }

  render() {
    return (
      <ContentPageLayout
        t={this.props.t}
        initiated={this.state.initiated}
        getContentLoading={this.props.getContentLoading}
        selectedContentItemDetails={this.props.selectedContentItemDetails}
      />
    );
  }
}

const ContentPage = enhance(ContentPageContainer, [withRouter, withTranslation()]);
export default ContentPage;
