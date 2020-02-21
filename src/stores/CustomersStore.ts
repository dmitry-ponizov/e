import {action, observable} from 'mobx';
import CustomersService from 'services/CustomersService';

export class CustomersStore {
  @observable
  customers: ICustomer[] = [];

  // GET CUSTOMERS ----------------------------------------------------------------------------------------------------/
  @observable
  getCustomersLoading = false;
  @observable
  getCustomersError = '';
  @action
  getCustomersStart = () => {
    this.getCustomersLoading = true;
    this.getCustomersError = '';
  };
  @action
  getCustomers = async (params?: IPaginationRequestParams): Promise<void> => {
    this.getCustomersStart();
    const transport = await CustomersService.getCustomers(params);
    if (!transport.success) {
      this.getCustomersLoading = false;
      this.getCustomersError = transport.message;
      return;
    }
    this.customers = transport.response.data.data;
    this.getCustomersLoading = false;
  };

  clearErrors = () => {
    this.getCustomersError = '';
  };
}

const customersStore = new CustomersStore();
export default customersStore;
