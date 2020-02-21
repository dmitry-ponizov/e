interface IFeed {
  id: string;
  name: string;
  merchantProfileId: string;
}

interface IFeedDetails {
  id: string;
  name: string;
  business: IFeedBusiness;
}

interface IFeedBusiness {
  initiated: boolean;
  search: IFormFieldState;
  multiSelectFields: IMultiSelectFieldsState;
  checkboxFields: ICheckboxFieldsState;
  datePicker: IFormFieldState;
}