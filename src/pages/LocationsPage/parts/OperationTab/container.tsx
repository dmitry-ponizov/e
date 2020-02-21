import React from 'react';
import enhance from 'helpers/enhance';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import {WithTranslation, withTranslation} from 'react-i18next';
import {RouteComponentProps} from 'react-router-dom';
import OperationTabLayout from 'pages/LocationsPage/parts/OperationTab/layout';
import HOURS from 'constants/hours';

interface IInjectedProps {
  selectedLocation: ILocation;
  selectedLocationDetails: ILocationDetails;
  updateLocationLoading: boolean;
  updateLocationError: string;
  updateLocationOperations: (operations: Partial<ILocationOperation>[]) => Promise<void>;
  setActiveLocationTab: (activeLocationTab: LocationTabType) => void;
  clearErrors: () => void;
}

export interface IOperationState {
  id: string;
  dayOfWeek: string;
  startTime: IFormSelectState;
  endTime: IFormSelectState;
  isClosed: boolean;
}

interface IState {
  operations: IOperationState[];
  hasChanges: boolean;
  exitModalIsOpen: boolean;
}

@inject(
  (rootStore: IRootStore): IInjectedProps => ({
    selectedLocation: rootStore.locationsStore.selectedLocation!,
    selectedLocationDetails: rootStore.locationsStore.selectedLocationDetails!,
    updateLocationLoading: rootStore.locationsStore.updateLocationLoading,
    updateLocationError: rootStore.locationsStore.updateLocationError,
    updateLocationOperations: rootStore.locationsStore.updateLocationOperations,
    setActiveLocationTab: rootStore.locationsStore.setActiveLocationTab,
    clearErrors: rootStore.locationsStore.clearErrors,
  }),
)
@observer
class OperationTabContainer extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = this.getInitialState(props.selectedLocationDetails);
  }

  requestedTab: LocationTabType | null = null;

  componentWillUnmount() {
    this.props.clearErrors();
  }

  getInitialState = (selectedLocationDetails: ILocationDetails): IState => {
    const operations = selectedLocationDetails.operations.map(operation => {
      return {
        id: operation.id,
        dayOfWeek: operation.dayOfWeek,
        startTime: {
          value: operation.startTime
            ? HOURS.find(option => operation.startTime && option.value === operation.startTime.split(':')[0]) || null
            : null,
          error: '',
        },
        endTime: {
          value: operation.endTime
            ? HOURS.find(option => operation.endTime && option.value === operation.endTime.split(':')[0]) || null
            : null,
          error: '',
        },
        isClosed: operation.isClosed,
      };
    });
    return {
      operations,
      hasChanges: false,
      exitModalIsOpen: false,
    };
  };

  handleChangeOperation = (operationIndex: number, type: 'startTime' | 'endTime', value: IOption) => {
    const {operations} = this.state;

    this.setState({
      operations: operations.map((operation, i) => {
        if (operationIndex === i) {
          return {
            ...operation,
            [type]: {
              value,
              error: operation[type].error,
            },
          };
        } else {
          return operation;
        }
      }),
      hasChanges: true,
    });
  };

  handleChangeClose = (operationIndex: number) => {
    const {operations} = this.state;
    this.setState({
      operations: operations.map((operation, i) => {
        if (operationIndex === i) {
          return {
            ...operation,
            isClosed: !operation.isClosed,
          };
        } else {
          return operation;
        }
      }),
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
    return true;
  };

  handleSave = async (): Promise<void> => {
    if (!this.isValid()) return;

    await this.props.updateLocationOperations(
      this.state.operations.map(operation => {
        return {
          id: operation.id,
          startTime: operation.startTime.value ? operation.startTime.value.value + ':00' : '00:00',
          endTime: operation.endTime.value ? operation.endTime.value.value + ':00' : '00:00',
          isClosed: operation.isClosed,
        };
      }),
    );

    if (!this.props.updateLocationError) {
      this.setState({
        hasChanges: false,
      });
    }
  };

  render() {
    return (
      <OperationTabLayout
        t={this.props.t}
        operations={this.state.operations}
        onChangeOperation={this.handleChangeOperation}
        onChangeClose={this.handleChangeClose}
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

const OperationTab = enhance(OperationTabContainer, [withTranslation()]);
export default OperationTab;
