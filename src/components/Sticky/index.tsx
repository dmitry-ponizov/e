import React, {useEffect, useRef} from 'react';
import styles from 'components/Sticky/styles.module.scss';

const Sticky: React.FC = ({children}) => {
  const holder = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isFixed = false;
    holder.current!.style.height = container.current!.offsetHeight + 'px';
    container.current!.style.width = container.current!.offsetWidth + 'px';

    const scrollHandler = () => {
      const passed = holder.current!.offsetTop - window.scrollY <= 0;
      if (passed && !isFixed) {
        container.current!.classList.add(styles.fixed);
        isFixed = true;
      } else if (!passed && isFixed) {
        container.current!.classList.remove(styles.fixed);
        isFixed = false;
      }
    };
    scrollHandler();

    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  return (
    <div className={`${styles.holder}`} ref={holder}>
      <div className={styles.container} ref={container}>
        {children}
      </div>
    </div>
  );
};

export default Sticky;
