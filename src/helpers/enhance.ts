const enhance = (component, enhancers) => {
  return [...enhancers].reverse().reduce((acc, enhancer) => enhancer(acc), component);
};

export default enhance;
