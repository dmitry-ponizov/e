import React, {ChangeEvent} from 'react';
import enhance from 'helpers/enhance';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import {WithTranslation, withTranslation} from 'react-i18next';
import {RouteComponentProps} from 'react-router-dom';
import IntegrationsTabLayout from 'pages/LocationsPage/parts/IntegrationsTab/layout';

interface IInjectedProps {
  selectedLocation: ILocation | null;
  selectedLocationDetails: ILocationDetails;
  updateLocationLoading: boolean;
  updateLocationError: string;
  updateLocationIntegrations: (integrations: Partial<ILocationIntegration>[]) => Promise<void>;
  setActiveLocationTab: (activeLocationTab: LocationTabType) => void;
  clearErrors: () => void;
}

interface IIntegrationState extends ILocationIntegration {
  value: string;
  error: string;
}

interface IState {
  textFields: IIntegrationState[];
  hasChanges: boolean;
  exitModalIsOpen: boolean;
}

@inject(
  (rootStore: IRootStore): IInjectedProps => ({
    selectedLocation: rootStore.locationsStore.selectedLocation,
    selectedLocationDetails: rootStore.locationsStore.selectedLocationDetails!,
    updateLocationLoading: rootStore.locationsStore.updateLocationLoading,
    updateLocationError: rootStore.locationsStore.updateLocationError,
    updateLocationIntegrations: rootStore.locationsStore.updateLocationIntegrations,
    setActiveLocationTab: rootStore.locationsStore.setActiveLocationTab,
    clearErrors: rootStore.locationsStore.clearErrors,
  }),
)
@observer
class IntegrationsTabContainer extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = this.getInitialState(props.selectedLocationDetails);
  }

  requestedTab: LocationTabType | null = null;

  componentWillUnmount() {
    this.props.clearErrors();
  }

  getInitialState = (selectedLocationDetails: ILocationDetails): IState => {
    return {
      textFields: selectedLocationDetails.integrations.map(integration => {
        return {
          ...integration,
          value: integration.value || '',
          error: '',
        };
      }),
      hasChanges: false,
      exitModalIsOpen: false,
    };
  };

  handleChangeTextField = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    const updatedField = [...this.state.textFields];
    updatedField[+name].value = value;

    this.setState({
      textFields: [...updatedField],
      hasChanges: true,
    });
  };

  handleRequestChangeTab = (tab: LocationTabType) => {
    if (this.state.hasChanges) {
      this.requestedTab = tab;
      this.setState({exitModalIsOpen: true});
    } else {
      this.props.setActiveLocationTab(tab);
    }
  };

  handleChangeTabAnswer = async (answer: ExitAnswer): Promise<void> => {
    switch (answer) {
      case 'continue':
        if (this.requestedTab) {
          this.props.setActiveLocationTab(this.requestedTab);
        }
        break;
      case 'cancel':
        this.setState({exitModalIsOpen: false});
        this.requestedTab = null;
        break;
      case 'save-continue':
        this.setState({exitModalIsOpen: false});
        await this.handleSave();
        if (!this.props.updateLocationError && this.requestedTab) {
          this.props.setActiveLocationTab(this.requestedTab);
        }
        break;
    }
  };

  handleReset = () => {
    this.setState(this.getInitialState(this.props.selectedLocationDetails));
  };

  isValid = (): boolean => {
    // TODO: add logic
    return true;
  };

  handleSave = async (): Promise<void> => {
    if (!this.isValid()) return;

    const arrayForUpdate = this.state.textFields.map(el => {
      return {
        id: el.id,
        value: el.value ? el.value : null,
      };
    });

    await this.props.updateLocationIntegrations(arrayForUpdate);

    if (this.props.updateLocationError) return;

    this.setState({
      hasChanges: false,
    });
  };

  render() {
    return (
      <IntegrationsTabLayout
        t={this.props.t}
        textFields={this.state.textFields}
        onChangeTextField={this.handleChangeTextField}
        onReset={this.handleReset}
        onSave={this.handleSave}
        selectedLocation={this.props.selectedLocation}
        hasChanges={this.state.hasChanges}
        updateLocationLoading={this.props.updateLocationLoading}
        onRequestChangeTab={this.handleRequestChangeTab}
        onChangeTabAnswer={this.handleChangeTabAnswer}
        exitModalIsOpen={this.state.exitModalIsOpen}
      />
    );
  }
}

const IntegrationsTab = enhance(IntegrationsTabContainer, [withTranslation()]);
export default IntegrationsTab;
