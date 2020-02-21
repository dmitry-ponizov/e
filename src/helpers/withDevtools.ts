import remotedev from 'mobx-remotedev';

const withDevtools = (stores: any) => {
  if (process.env.NODE_ENV === 'production') {
    return stores;
  }
  return Object.keys(stores).reduce((acc: any, name: string) => {
    acc[name] = remotedev(stores[name], {
      name,
      onlyActions: true,
    });
    return acc;
  }, {});
};

export default withDevtools;
