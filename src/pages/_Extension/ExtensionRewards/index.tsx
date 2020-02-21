import React, {useEffect, useState} from 'react';
import styles from 'pages/_Extension/ExtensionRewards/styles.module.scss';
import config from 'constants/config';
import ContentCard from 'components/ContentCard';
import enhance from 'helpers/enhance';
import {WithTranslation, withTranslation} from 'react-i18next';

const rewards = [
  'Volvo Cars of North America',
  'BP',
  'CVS',
  'Discount Tire',
  'Del Taco',
  'Popeyes Louisiana Kitchen',
  'Planet Fitness',
  'GYRO CAFE',
  'PETCO',
  'COLLETTA'
];

interface IAttachedToTransactionReward {
  transactionNode: HTMLElement;
  bankName: string;
}

let transactionsListRef: HTMLElement | null = null;
let transactionListLastPosition: DOMRect;
let rewardsListRef: HTMLElement | null = null;
let transactionRewardMap = new Map();
let baseTransactionHeight = 0;

const ExtensionRewardsBase: React.FC<WithTranslation> = ({t}) => {
  const [activeRewards, setActiveRewards] = useState<IAttachedToTransactionReward[]>([]);

  const getBankConfig = () => {
    switch(location.href) {
      case 'http://localhost:3000/discover.html':
          return config['BANKS']['discover']
      case 'http://localhost:3000/american-express.html':
          return config['BANKS']['americanExpress']
      default: 
          return config['BANKS']['capitalOne']
    }
  }

  const updateRewards = () => {
    if (!transactionsListRef) return;
    // get updated transactions list position
    transactionListLastPosition = transactionsListRef.getBoundingClientRect();

    const bankConfig = getBankConfig()
    // get all transactions from list
    const transactionsNodes = Array.from(
      transactionsListRef.querySelectorAll(bankConfig.transaction),
    ) as HTMLElement[];

    // collect rewards that need to show
    const nextRewards = transactionsNodes.reduce((acc, transactionNode) => {
      if (!transactionListLastPosition) return acc;

      // skip transaction out of screen (include offset)
      const positionNodeY = transactionListLastPosition.top + transactionNode.offsetTop;
      const topLine =
        positionNodeY +
        baseTransactionHeight +
        config.EXTENSION.rewardVerticalMargin * 2 +
        config.EXTENSION.rewardHeight +
        config.EXTENSION.rewardRenderOutOfScreenOffset;
      const bottomLine = positionNodeY - config.EXTENSION.rewardRenderOutOfScreenOffset;
      if (topLine < 0 || bottomLine > window.innerHeight) return acc;

      // skip transactions without reward
      const elementWithBankName = transactionNode.querySelector(bankConfig.merchantName) as HTMLElement;

      
      if (!elementWithBankName || rewards.indexOf(elementWithBankName.innerText) === -1) return acc;

      // add space for reward under transaction
      const marginBottom = config.EXTENSION.rewardHeight + config.EXTENSION.rewardVerticalMargin * 2;
      transactionNode.style.marginBottom = `${marginBottom}px`;

      // collect active reward
      return [...acc, {bankName: elementWithBankName.innerText, transactionNode}];
    }, [] as IAttachedToTransactionReward[]);

    // compare old and new rewards
    if (
      activeRewards.length !== nextRewards.length ||
      activeRewards.every((el, i) => el.transactionNode.id === nextRewards[i].transactionNode.id)
    ) {
      // render new rewards
      setActiveRewards(nextRewards);
      transactionRewardMap = new Map();
    } else {
      // synchronize old rewards position with transactions

      activeRewards.forEach(attachedReward => {
        console.log( transactionListLastPosition.top,
          attachedReward.transactionNode.offsetTop,
          baseTransactionHeight,
          config.EXTENSION.rewardVerticalMargin,)
        const rewardRef = transactionRewardMap.get(attachedReward.transactionNode);
        const translateY =
          transactionListLastPosition.top +
          attachedReward.transactionNode.offsetTop +
          baseTransactionHeight +
          config.EXTENSION.rewardVerticalMargin;
        rewardRef.style.transform = `translateY(${translateY}px)`;
      });
    }
  };



  useEffect(() => {
    // ENTRY POINT
    const intervalForRewards = setInterval(() => {
      if (!rewardsListRef) return;
      const bankConfig = getBankConfig()
      // get transactions list
      transactionsListRef = document.querySelector(bankConfig.transactionContainer);

      if (!transactionsListRef) return;

      // get transactions list initial position and base transaction height
      transactionsListRef.style.position = 'relative';
      transactionListLastPosition = transactionsListRef.getBoundingClientRect();
      rewardsListRef.style.left = transactionListLastPosition.left + 'px';
    
      const transactionNode = transactionsListRef.querySelector(bankConfig.transaction) as HTMLElement;
      if (transactionNode) {
        baseTransactionHeight = transactionNode.offsetHeight;
      }

      // setup scroll listener
      window.addEventListener('scroll', () => {
        // register task in queue after Angular tasks
        setTimeout(updateRewards, 0);
      });

      // setup resize listener
      window.addEventListener('resize', () => {
        if (!transactionsListRef || !rewardsListRef) return;
        // get current transactions list position
        const transactionListCurrentPosition = transactionsListRef.getBoundingClientRect();

        // synchronize LEFT position of transactions list and rewards list
        if (transactionListCurrentPosition.left !== transactionListLastPosition.left) {
          transactionListLastPosition = transactionListCurrentPosition;
          rewardsListRef.style.left = transactionListCurrentPosition.left + 'px';
        }
      });

  

      // initial rewards update
      updateRewards();

      clearInterval(intervalForRewards);
    }, 100);
  }, []);

  return (
    <div className={styles.container} ref={ref => (rewardsListRef = ref)}>
      {activeRewards.map((attachedReward, i) => {
        const translateY =
          transactionListLastPosition.top +
          attachedReward.transactionNode.offsetTop +
          baseTransactionHeight +
          config.EXTENSION.rewardVerticalMargin;
          console.log( transactionListLastPosition.top,
            attachedReward.transactionNode.offsetTop,
            baseTransactionHeight,
            config.EXTENSION.rewardVerticalMargin,)
        return (
          <div
            className={styles.reward}
            key={i}
            style={{transform: `translateY(${translateY}px)`}}
            ref={ref => {
              // save transaction/reward link to map
              transactionRewardMap.set(attachedReward.transactionNode, ref);
            }}
          >
            <ContentCard
              t={t}
              isLogoShow={true}
              isImageShow={true}
              cardContent={{
                name: attachedReward.bankName,
                logo: 'test',
                rules: 'Rules',
                expires: 'Expires',
                offerCode: 12345678,
              }}
              cardInfoBar={{
                points: 10,
                level: 9,
                program: 'Program',
                reward: 'Reward',
                next: 'Next',
              }}
              cardSocialData={['1', '2', '3', '4', '5', '6']}
              cardMerchantData={{
                title: 'Title',
                name: 'Name',
                address: 'Address',
                phone: 'Phone',
                type: 'Type',
                workTime: 'Work Time',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

const ExtensionRewards = enhance(ExtensionRewardsBase, [withTranslation()]);
export default ExtensionRewards;
