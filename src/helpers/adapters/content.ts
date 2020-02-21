import {ITransportResponse} from 'services/transport';

export const contentGetAdapterIn = (transport: ITransportResponse): IContentItem[] => {
  return transport.response.data.data.map(contentItem => {
    return {
      id: contentItem.id,
      name: contentItem.name,
      location: {id: contentItem.locationId},
      isPublish: contentItem.lastPublishedContent ? contentItem.lastPublishedContent.isActive : false,
    };
  });
};

export const contentItemDetailsAdapterIn = (transport: ITransportResponse): IContentItemDetails => {
  const {data} = transport.response;
  // https://www.screencast.com/t/0e5eAx2ZSa  DELETE AFTER FINISH CONFIG INTERFACE
  // https://www.screencast.com/t/rvq8Vfqg DELETE AFTER FINISH CONFIG INTERFACE
  return {
    id: data.id,
    name: data.name,
    location: {id: data.locationId},
    lastPublishedContent: data.lastPublishedContent ? data.lastPublishedContent : null,
    offer: data.offer,
    // image: data.image ? data.image : null,
    isIncludesOffer: data.isIncludesOffer,
    image: data.image,
    groups: data.targetGroupLinks.map(group => ({id: group.targetGroupId, name: ''})),
    text: data.text ? data.text : null,
    isLogoEnabled: data.isLogoEnabled,
    integrationId: data.integrationId,
    isPublish: data.lastPublishedContent ? data.lastPublishedContent.isActive : false,
  };
};
