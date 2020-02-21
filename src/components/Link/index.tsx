import React, {HTMLProps} from 'react';
import styles from 'components/Link/styles.module.scss';

const Link: React.FC<HTMLProps<HTMLDivElement>> = props => {
  let linkClasses = styles.link;
  if (props.className) {
    linkClasses += ` ${props.className}`;
  }

  return (
    <div {...props} className={linkClasses}>
      {props.children}
    </div>
  );
};

export default Link;
