export const months: IOption[] = [
  {label: 'January', value: '0'},
  {label: 'February', value: '1'},
  {label: 'March', value: '2'},
  {label: 'April', value: '3'},
  {label: 'May', value: '4'},
  {label: 'June', value: '5'},
  {label: 'July', value: '6'},
  {label: 'August', value: '7'},
  {label: 'September', value: '8'},
  {label: 'October', value: '9'},
  {label: 'November', value: '10'},
  {label: 'December', value: '11'},
];

const currentYear = new Date().getFullYear();

const getYears = (firstYear: number, yearsNumber: number): IOption[] => {
  const yearsArray: IOption[] = [];

  for (let i = firstYear; i <= yearsNumber; i += 1) {
    yearsArray.push({label: `${i}`, value: `${i}`});
  }
  return yearsArray;
};

export const fromMonth = new Date(currentYear - 10, 0);
export const toMonth = new Date(currentYear + 10, 11);
export const years = getYears(currentYear - 10, currentYear + 10);
export const bornYears = getYears(currentYear - 80, currentYear - 18);
