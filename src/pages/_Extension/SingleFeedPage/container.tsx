import React, { Component } from 'react'
import {withRouter} from 'react-router-dom';
import SingleFeedPageLayout from './layout';
import {withTranslation, WithTranslation} from 'react-i18next';
import enhance from 'helpers/enhance';
import { TFunction } from 'i18next';


interface IProps {
  t: TFunction;
}

 class SingleFeedPageContainer extends Component<IProps & WithTranslation>{

    render() {
        return (
          <SingleFeedPageLayout t={this.props.t}  />
        )
      }
 }

const CustomerFeedSinglePage = enhance(SingleFeedPageContainer, [withRouter, withTranslation()]);
export default CustomerFeedSinglePage;
