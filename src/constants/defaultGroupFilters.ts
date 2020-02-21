export const defaultGroupFilters = [
  {field: 'distance', conditions: {between: {from: 0, to: 1000}}},
  {field: 'gender', conditions: {eq: 'male'}},
  {field: 'relationship', conditions: {eq: 'single'}},
  {field: 'children', conditions: {eq: 'pregnant'}},
  {field: 'home', conditions: {eq: 'own'}},
  {field: 'yearOfBirth', conditions: {eq: 1970}},
  {field: 'education', conditions: {eq: 'high-school-degree'}},
  {field: 'employment', conditions: {eq: 'employed-self'}},
  {field: 'ethnic', conditions: {eq: 'hispanic-latino'}},
  {field: 'income', conditions: {eq: '0-9999'}},
  {field: 'region', conditions: {in: ['AL']}},
  // TODO: change postalCode
  {field: 'postalCode', conditions: {in: ['AL']}},
];
