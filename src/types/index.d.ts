interface IAddressSuggestion {
  text: string;
  street_line: string;
  city: string;
  state: string;
}

// GROUPS OF FIELDS ***************************************************************************************************/
interface ITextFieldsState {
  [key: string]: IFormFieldState;
}
interface ISelectFieldsState {
  [key: string]: IFormSelectState;
}

interface IMultiSelectFieldsState {
  [key: string]: IFormMultiSelectState;
}
interface IFiltersFieldsState {
  [key: string]: IFormFilterState;
}
interface ICheckboxFieldsState {
  [key: string]: boolean;
}
// FIELDS *************************************************************************************************************/
interface IFormFieldState {
  value: string;
  error: string;
}
interface IFormSelectState {
  value: IOption | null;
  error: string;
}
interface IFormMultiSelectState {
  values: string[];
  error: string;
}
interface IFormFilterState {
  values: string[];
  operator: IOption;
  error: string;
}
/**********************************************************************************************************************/
interface IPaginationRequestParams {
  filter?: string[] | string;
  sort?: string[] | string;
  page?: number;
  per_page?: number;
  offset?: number;
  join?: string[] | string;
}

interface ILoadOptionsResponse {
  options: IOption[];
  hasMore: boolean;
}

interface IOption {
  label: string;
  value: string;
}

interface IMultiSelectsState {
  [key: string]: IFormMultiSelect;
}

interface IFormMultiSelect {
  values: string[];
  error: string;
}

type ExitAnswer = 'continue' | 'cancel' | 'save-continue';
