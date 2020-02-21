import React from 'react';
import Slider from 'rc-slider';
import 'components/SliderHOC/styles.scss';

interface IProps {
  className?: string;
  min: number;
  max: number;
  defaultValue?: [number, number];
  onChange: () => void;
}

const SliderHOC: React.FC<IProps> = ({onChange, min, max}) => {
  return <Slider.Range min={min} max={max} onChange={onChange} defaultValue={[5, 10]} />;
};

export default SliderHOC;
