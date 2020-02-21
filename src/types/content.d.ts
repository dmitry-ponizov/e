interface IContentItem {
  id: string;
  name: string;
  location: IContentLocation;
  isPublish: boolean;
}

interface IContentItemDetails extends IContentItem {
  isLogoEnabled: boolean;
  integrationId: string | null;
  image: string | null;
  text: string | null;
  lastPublishedContent: ILastPublishedContent;
  groups: IContentGroup[];
  offer: IContentOffer;
  isIncludesOffer: boolean;
}

interface ILastPublishedContent {
  id: string;
  publishedAt: string;
  unpublishedAt: string;
  isActive: boolean;
}

interface IContentLocation {
  id: string;
  name?: string;
  business?: ILocationContact;
  integrations?: ILocationIntegration;
}

interface IContentGroup {
  id: string;
  name?: string;
}

interface IContentOffer {
  // id: string;
  conditions: string;
  isSharingAllowed: boolean;
  expirationDate: string;
}
