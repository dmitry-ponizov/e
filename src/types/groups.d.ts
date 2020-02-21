interface IGroup {
  id: string;
  name: string;
  businessId: string;
  priority: number;
  customers: string;
}

interface IGroupsTotalCustomers {
  id: string;
  totalCustomers: string;
}

interface IGroupDetails extends IGroup {
  filters: IGroupField[];
}

type Operand = string | number | boolean;
type BetweenOperand = {
  from: Operand;
  to: Operand;
};
interface IFilterGroupConditions {
  eq?: Operand;
  gt?: Operand;
  lt?: Operand;
  gte?: Operand;
  lte?: Operand;
  in?: Operand[];
  between?: BetweenOperand;
}

interface IGroupField {
  name: string;
  conditions: IFilterGroupConditions;
}

interface IGroupFieldRequest {
  field: string;
  conditions: IFilterGroupConditions;
}

interface IGroupCreateRequestData {
  name: string;
  businessId: string;
  priority: number;
  filters: IGroupFieldRequest[];
}

interface IGroupUpdateRequestData {
  filters: IGroupFieldRequest[];
}

type GroupTabType = 'demographic' | 'behavioral';
