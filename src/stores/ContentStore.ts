import {action, observable} from 'mobx';
import ContentService from 'services/ContentService';
import Toast from 'components/Toast';
import getErrorsFromResponse from 'helpers/getErrorsFromResponse';
import {contentGetAdapterIn, contentItemDetailsAdapterIn} from 'helpers/adapters/content';
import GroupsService from 'services/GroupsService';
import LocationsService from 'services/LocationsService';
import MESSAGES from 'constants/messages';

export class ContentStore {
  @observable
  content: IContentItem[] = [];
  @observable
  contentLocations: IContentLocation[] = [];

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
  toggleDeleteModal = (value: boolean, chosenItems?: string[]) => {
    if (chosenItems) {
      this.chosenContentItems = chosenItems;
    }
    this.deleteModalIsActive = value;
  };

  // GET CONTENT ----------------------------------------------------------------------------------------------------/
  @observable
  getContentLoading = false;
  @observable
  getContentError = '';
  @action
  getContentStart = () => {
    this.getContentLoading = true;
    this.getContentError = '';
  };
  @action
  getContent = async (params?: IPaginationRequestParams): Promise<void> => {
    this.getContentStart();

    const transport = await ContentService.getContent(params);

    if (!transport.success) {
      this.getContentLoading = false;
      this.getContentError = getErrorsFromResponse(transport);
      return Toast.show(this.getContentError, {type: 'danger'});
    }

    const locationsTransport = await LocationsService.getLocations({
      filter: transport.response.data.data.reduce((acc, contentItem, i) => {
        return acc + (i === 0 ? contentItem.locationId : `,${contentItem.locationId}`);
      }, 'id||in||'),
    });

    if (!locationsTransport.success) {
      this.getContentLoading = false;
      return Toast.show(getErrorsFromResponse(locationsTransport), {type: 'danger'});
    }

    this.content = contentGetAdapterIn(transport).map(contentItem => {
      const {name} = locationsTransport.response.data.data.find(location => location.id === contentItem.location.id);
      return {
        ...contentItem,
        location: {...contentItem.location, name},
      };
    });

    if (this.content.length) {
      this.selectContentItem(this.content[0]);
    }

    this.getContentLoading = false;
  };

  // CONTENT ITEM DETAILS --------------------------------------------------------------------------------------------------/
  @observable
  selectedContentItem: IContentItem | null = null;
  @observable
  selectedContentItemDetails: IContentItemDetails | null = null;
  @observable
  selectContentLoading = false;
  @observable
  selectContentError = '';
  @action
  selectContentStart = (contentItem: IContentItem) => {
    this.selectedContentItem = contentItem;
    this.selectedContentItemDetails = null;
    this.selectContentLoading = true;
    this.selectContentError = '';
  };
  @action
  selectContentItem = async (contentItem: IContentItem): Promise<void> => {
    this.selectContentStart(contentItem);

    const transport = await ContentService.getContentDetails(contentItem.id, {
      join: ['targetGroupLinks', 'offer'],
    });

    // prevent errors when user reselect fast
    if (!this.selectedContentItem || this.selectedContentItem.id !== contentItem.id) return;

    if (!transport.success) {
      this.selectContentLoading = false;
      this.selectContentError = getErrorsFromResponse(transport);
      return Toast.show(this.selectContentError, {type: 'danger'});
    }

    const {
      groups,
      offer,
      isIncludesOffer,
      image,
      text,
      integrationId,
      isLogoEnabled,
      lastPublishedContent,
    } = contentItemDetailsAdapterIn(transport);

    const groupTransport = await GroupsService.getGroups({
      filter: groups.reduce((acc, group, i) => {
        return acc + (i === 0 ? group.id : `,${group.id}`);
      }, 'id||in||'),
    });

    if (!groupTransport.success) {
      this.selectContentLoading = false;
      return Toast.show(getErrorsFromResponse(groupTransport), {type: 'danger'});
    }

    const locationBusinessTransport = await LocationsService.getLocationBusiness(contentItem.location.id);
    const locationIntegrationsTransport = await LocationsService.getLocationIntegrations(contentItem.location.id);

    console.log('CURRENT CONTENT ITEM', contentItem.id);

    this.selectedContentItemDetails = {
      ...contentItem,
      groups: groupTransport.response.data.data.map(group => ({
        id: group.id,
        name: group.name,
      })),
      integrationId,
      isLogoEnabled,
      image,
      text,
      lastPublishedContent,
      offer,
      isIncludesOffer,
      location: {
        ...contentItem.location,
        business: locationBusinessTransport.response.data.data[0],
        integrations: locationIntegrationsTransport.response.data.data,
      },
    };
    this.selectContentLoading = false;
  };

  // UPDATE CONTENT ITEM --------------------------------------------------------------------------------------------------/
  @observable
  updateContentLoading = false;
  @observable
  updateContentError = '';
  @action
  updateContentStart = () => {
    this.updateContentLoading = true;
    this.updateContentError = '';
  };
  @action
  updateContent = async (contentItemId: string, data: Partial<IContentItemDetails>): Promise<void> => {
    this.updateContentStart();

    console.log(contentItemId);

    const {groups, location, ...filteredData} = data;
    const transport = await ContentService.updateContent(contentItemId, {
      ...filteredData,
      name: data.name!,
      isLogoEnabled: data.isLogoEnabled!,
      locationId: location!.id,
      targetGroupLinks: groups!.map(group => ({
        targetGroupId: group.id,
      })),
    });

    if (!transport.success) {
      this.updateContentLoading = false;
      this.updateContentError = getErrorsFromResponse(transport);
      return Toast.show(this.updateContentError, {type: 'danger'});
    }

    const {integrationId, image, text, offer} = transport.response.data.data;

    this.selectedContentItemDetails = {
      ...this.selectedContentItemDetails,
      ...data,
      id: contentItemId,
      name: data.name!,
      groups: groups!,
      location: location!,
      isLogoEnabled: data.isLogoEnabled!,
      integrationId,
      image,
      text,
      lastPublishedContent: this.selectedContentItemDetails!.lastPublishedContent,
      isPublish: this.selectedContentItemDetails!.lastPublishedContent
        ? this.selectedContentItemDetails!.lastPublishedContent!.isActive
        : false,
      isIncludesOffer: !!transport.response.data.isIncludesOffer,
      offer: offer || null,
    };

    this.updateContentLoading = false;
    Toast.show(MESSAGES.CONTENT.updateSuccess, {type: 'success'});
  };

  // UPDATE CONTENT ITEM IMAGE -----------------------------------------------------------------------------------
  @observable
  updateContentImageLoading = false;
  @observable
  updateContentImageError = '';
  @action
  updateContentItemImageStart = () => {
    this.updateContentImageLoading = true;
    this.updateContentImageError = '';
  };
  @action
  updateContentItemImage = async (id: string, file: File | null): Promise<void> => {
    this.updateContentItemImageStart();

    const transport = await ContentService.updateContentItemImage(id, file);

    if (!transport.success) {
      this.updateContentImageLoading = false;
      this.updateContentImageError = getErrorsFromResponse(transport);
      return Toast.show(this.updateContentImageError, {type: 'danger'});
    }

    this.updateContentImageLoading = false;
    Toast.show(MESSAGES.CONTENT.updateImageSuccess, {type: 'success'});
  };

  // CREATE CONTENT ---------------------------------------------------------------------------------------------------/
  @observable
  createContentItemLoading = false;
  @observable
  createContentItemError = '';
  @action
  createContentItemStart = () => {
    this.createContentItemLoading = true;
    this.createContentItemError = '';
  };
  @action
  createContentItem = async (data: Partial<IContentItemDetails>): Promise<void> => {
    this.createContentItemStart();

    const transport = await ContentService.createContentItem({
      name: data.name!,
      locationId: data.location?.id!,
      isLogoEnabled: data.isLogoEnabled!,
      targetGroupLinks: data.groups!.map(group => ({targetGroupId: group.id}))!,
    });

    if (!transport.success) {
      this.createContentItemLoading = false;
      this.createContentItemError = getErrorsFromResponse(transport);
      return Toast.show(this.createContentItemError, {type: 'danger'});
    }

    const {name, id} = transport.response.data;

    this.content = [
      ...this.content,
      {
        id,
        name,
        // isLogoEnabled,
        isPublish: false,
        // location: this.contentLocations.find(location => location.id === locationId)!,
        location: data.location!,
      },
    ];
    this.createModalIsActive = false;
    this.createContentItemLoading = false;
  };

  //PUBLISH CONTENT ITEMS -----------------------------------------------------------------------------------
  @observable
  contentPublishLoading = false;
  @observable
  contentPublishError = '';
  @action
  publishContentStart = () => {
    this.contentPublishError = '';
    this.contentPublishLoading = true;
  };
  @action
  publishContentItems = async (isPublish: boolean, data): Promise<void> => {
    this.publishContentStart();

    const transport = await ContentService.publishContent(isPublish, data);

    if (!transport.success) {
      this.contentPublishLoading = false;
      this.contentPublishError = getErrorsFromResponse(transport);
      return Toast.show(this.contentPublishError, {type: 'danger'});
    }

    const respondedContent = transport.response.data;

    this.content = this.content.map(contentItem => {
      if (data.contentDraftIds.indexOf(contentItem.id) === -1) return contentItem;
      const updatedContentItem = respondedContent.find(
        publishedContentItem => publishedContentItem.contentDraftId === contentItem.id,
      );

      if (!updatedContentItem) {
        Toast.show(MESSAGES.CONTENT.singlePublishError(contentItem.name), {type: 'danger', duration: 10000});
        return contentItem;
      }

      return {
        ...contentItem,
        isPublish,
        // publishStop: updatedContentItem.publishStop,
        // publishStart: updatedContentItem.publishStart,
      };
    });

    if (this.selectedContentItemDetails && this.selectedContentItemDetails.id === data.contentDraftIds[0]) {
      this.selectedContentItemDetails = {
        ...this.selectedContentItemDetails,
        isPublish,
        // publishStop: respondedContent[0].publishStop,
        // publishStart: respondedContent[0].publishStart,
      };
    }

    Toast.show(MESSAGES.CONTENT.publishSuccess(respondedContent.length), {type: 'success'});
    this.contentPublishLoading = false;
  };

  // DELETE CONTENT --------------------------------------------------------------------------------------------------/
  @observable
  deleteContentItemLoading = false;
  @observable
  deleteContentItemError = '';
  @observable
  chosenContentItems: string[] = [];
  @action
  deleteContentItemStart = () => {
    this.deleteContentItemLoading = true;
    this.deleteContentItemError = '';
  };
  @action
  deleteContentItem = async (): Promise<void> => {
    if (!this.chosenContentItems.length) return;

    this.deleteContentItemStart();

    const transport = await ContentService.deleteContentItems(this.chosenContentItems);

    if (!transport.success) {
      this.deleteContentItemLoading = false;
      this.deleteContentItemError = getErrorsFromResponse(transport);
      return Toast.show(this.deleteContentItemError, {type: 'danger'});
    }

    this.content = this.content.filter(contentItem => !this.chosenContentItems.includes(contentItem.id));
    this.chosenContentItems = [];
    this.deleteContentItemLoading = false;
    this.deleteModalIsActive = false;

    if (!this.content.length) return;
    this.selectContentItem(this.content[0]);
  };

  clearErrors = () => {
    this.getContentError = '';
    this.createContentItemError = '';
    this.deleteContentItemError = '';
    this.selectContentError = '';
  };
}

const contentStore = new ContentStore();
export default contentStore;
