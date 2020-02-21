import {action, observable} from 'mobx';
import GroupsService from 'services/GroupsService';
import {
  groupsFiltersAdapterIn,
  groupsUpdateAdapterOut,
  groupsGetAdapterIn,
  groupsCreateAdapterIn,
} from 'helpers/adapters/groups';
import getErrorsFromResponse from 'helpers/getErrorsFromResponse';
import Toast from 'components/Toast';
import MESSAGES from 'constants/messages';

export class GroupsStore {
  @observable
  groups: IGroup[] = [];

  // TABS -------------------------------------------------------------------------------------------------------------/
  @observable
  activeGroupTab: GroupTabType = 'demographic';
  @action
  setActiveGroupTab = (activeGroupTab: GroupTabType) => {
    this.activeGroupTab = activeGroupTab;
  };

  // MODALS -----------------------------------------------------------------------------------------------------------/
  @observable
  createModalIsActive = false;
  @observable
  deleteModalIsActive = false;
  @action
  toggleCreateModal = (value: boolean) => {
    this.createModalIsActive = value;
  };
  @action
  toggleDeleteModal = (value: boolean, groupsId?: string[]) => {
    if (groupsId) {
      this.chosenGroups = groupsId;
    }
    this.deleteModalIsActive = value;
  };

  // GET GROUPS -------------------------------------------------------------------------------------------------------/
  @observable
  getGroupsLoading = false;
  @observable
  getGroupsError = '';
  @action
  getGroupsStart = () => {
    this.getGroupsLoading = true;
    this.getGroupsError = '';
  };
  @action
  getGroups = async (params?: IPaginationRequestParams): Promise<void> => {
    this.getGroupsStart();

    const transport = await GroupsService.getGroups(params);

    if (!transport.success) {
      this.getGroupsLoading = false;
      this.getGroupsError = transport.message;
      return Toast.show(this.getGroupsError, {type: 'danger'});
    }

    this.groups = groupsGetAdapterIn(transport);

    if (!this.groups.length) return;
    this.selectGroup(this.groups.find(group => group.priority === 0)!);
    this.getGroupsStatuses();

    this.getGroupsLoading = false;
  };

  // GET GROUP STATUSES-------------------------------------------------------------------------------------------------------/
  @observable
  getGroupsTotalCustomersError = '';
  @action
  getGroupsStatuses = async (ids?: string[]): Promise<void> => {
    this.getGroupsTotalCustomersError = '';

    let requestGroups: IGroup[];
    let requestIds: string[] = [];
    if (ids) {
      requestGroups = this.groups.filter(group => ids.indexOf(group.id) > -1);
      requestIds = ids;
    } else {
      requestGroups = this.groups;
      requestIds = requestGroups.map(group => group.id);
    }

    const transports = await Promise.all(
      requestGroups.map(group =>
        GroupsService.getGroupsTotalCustomers({
          filter: `targetGroupId||eq||${group.id}`,
          per_page: 1,
        }),
      ),
    );

    const failedTransport = transports.find(transport => !transport.success);

    if (failedTransport) {
      this.getGroupsTotalCustomersError = getErrorsFromResponse(failedTransport);
      return Toast.show(this.getGroupsTotalCustomersError, {type: 'danger'});
    }

    this.groups = this.groups.map(group => {
      const index = requestIds.indexOf(group.id);
      if (index === -1) return group;
      return {
        ...group,
        customers: `${transports[index].response.data.total}`,
      };
    });
    this.groups.forEach(group => GroupsService.refreshGroup(group.businessId));
  };

  // REFRESH GROUPS-------------------------------------------------------------------------------------------------------/
  @action
  refreshGroups = async (businessId: string): Promise<void> => {
    const transport = await GroupsService.refreshGroup(businessId);
    if (!transport.success) {
      return Toast.show(transport.message, {type: 'danger'});
    }
    this.getGroupsStatuses();
  };

  // SELECT GROUP -----------------------------------------------------------------------------------------------------/
  @observable
  selectedGroup: IGroup | null = null;
  @observable
  selectedGroupDetails: IGroupDetails | null = null;
  @observable
  selectGroupLoading = false;
  @observable
  selectGroupError = '';
  @action
  selectGroupStart = group => {
    this.selectedGroup = group;
    this.selectedGroupDetails = null;
    this.selectGroupLoading = true;
    this.selectGroupError = '';
  };
  @action
  selectGroup = async (group: IGroup): Promise<void> => {
    this.selectGroupStart(group);
    // prevent errors when user reselect fast
    if (!this.selectedGroup || this.selectedGroup.id !== group.id) return;

    const transport = await GroupsService.getGroupFilters(group.id);

    if (!transport.success) {
      this.selectGroupLoading = false;
      this.selectGroupError = transport.message;
      return Toast.show(this.selectGroupError, {type: 'danger'});
    }

    this.selectedGroupDetails = {
      ...group,
      filters: groupsFiltersAdapterIn(transport),
    };

    this.selectGroupLoading = false;
  };

  // CREATE GROUP -----------------------------------------------------------------------------------------------------/
  @observable
  createGroupLoading = false;
  @observable
  createGroupError = '';
  @action
  createGroupStart = () => {
    this.createGroupLoading = true;
    this.createGroupError = '';
  };
  @action
  createGroup = async (data: IGroupCreateRequestData): Promise<void> => {
    this.createGroupStart();

    const transport = await GroupsService.createGroup(data);

    if (!transport.success) {
      this.createGroupLoading = false;
      this.createGroupError = transport.message;
      return Toast.show(this.createGroupError, {type: 'danger'});
    }

    const group = groupsCreateAdapterIn(transport);
    this.groups = [...this.groups, group];

    this.createModalIsActive = false;
    this.createGroupLoading = false;
    this.getGroupsStatuses([group.id]);
    this.selectGroup(group);
    Toast.show(MESSAGES.GROUPS.createSuccess, {type: 'success'});
  };

  // UPDATE GROUP -----------------------------------------------------------------------------------------------------/
  @observable
  updateGroupLoading = false;
  @observable
  updateGroupError = '';
  @action
  updateGroupStart = () => {
    this.updateGroupLoading = true;
    this.updateGroupError = '';
  };
  @action
  updateGroup = async (updatingGroupFilters: IGroupField[]): Promise<void> => {
    this.updateGroupStart();
    const transport = await GroupsService.updateGroup(
      this.selectedGroupDetails!.id,
      groupsUpdateAdapterOut(updatingGroupFilters),
    );

    if (!transport.success) {
      this.updateGroupLoading = false;
      this.updateGroupError = getErrorsFromResponse(transport);
      return Toast.show(this.selectGroupError, {type: 'danger'});
    }

    this.selectedGroupDetails!.filters = updatingGroupFilters.map(filter => {
      return {
        name: filter.name!,
        conditions: filter.conditions!,
      };
    });
    this.updateGroupLoading = false;
    Toast.show(MESSAGES.GROUPS.updateSuccess, {type: 'success'});
  };

  // DELETE GROUPS-----------------------------------------------------------------------------------------------------/
  @observable
  deleteGroupLoading = false;
  @observable
  deleteGroupError = '';
  @observable
  chosenGroups: string[] = [];
  @action
  deleteGroupsStart = () => {
    this.deleteGroupLoading = true;
    this.deleteGroupError = '';
  };
  @action
  deleteGroups = async (): Promise<void> => {
    if (!this.chosenGroups.length) return;

    this.deleteGroupsStart();

    const transport = await GroupsService.deleteGroups(this.chosenGroups);

    if (!transport.success) {
      this.deleteGroupLoading = false;
      this.deleteGroupError = transport.message;
      return Toast.show(this.deleteGroupError, {type: 'danger'});
    }

    this.groups = this.groups.filter(group => !this.chosenGroups.includes(group.id));
    this.chosenGroups = [];
    this.deleteModalIsActive = false;
    this.deleteGroupLoading = false;

    if (this.groups.length) {
      this.selectGroup(this.groups[0]);
    }
  };

  clearErrors = () => {
    this.getGroupsError = '';
    this.createGroupError = '';
    this.deleteGroupError = '';
    this.updateGroupError = '';
    this.selectGroupError = '';
  };
}

const groupsStore = new GroupsStore();
export default groupsStore;
