import {action, observable} from 'mobx';
import {ExtensionRoute} from 'constants/extensionRoutes';

export class SimpleRouterStore {
  @observable
  activeRoute: ExtensionRoute | null = null;

  @action
  setRoute = (route: ExtensionRoute | null) => {
    this.activeRoute = route;
  }
}

const simpleRouterStore = new SimpleRouterStore();
export default simpleRouterStore;
