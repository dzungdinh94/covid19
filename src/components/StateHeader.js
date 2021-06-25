import {SPRING_CONFIG_NUMBERS} from '../constants.js';
import {formatDate, formatNumber, getStatistic} from '../utils/commonFunctions';

import {memo, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {animated, useSpring} from 'react-spring';

function StateHeader({data}) {
  console.log('state', data);
  const {t} = useTranslation();

  const trail = useMemo(() => {
    const styles = [];

    [0, 0, 0].map((element, index) => {
      styles.push({
        animationDelay: `${index * 250}ms`,
      });
      return null;
    });

    return styles;
  }, []);

  const spring = useSpring({
    total: getStatistic(data, 'total', 'total'),
    config: SPRING_CONFIG_NUMBERS,
  });

  return (
    <div className="StateHeader">
      <div className="header-left">Vietnam</div>

      <div className="header-right fadeInUp" style={trail[2]}>
        <h5>{t('Confirmed')}</h5>
        <animated.h2>{data?.total?.confirmed || '0'}</animated.h2>
        <h5>{t('Recovered')}</h5>
        <animated.h2>{data?.total?.recovered || '0'}</animated.h2>
        <h5>{t('Deadths')}</h5>
        <animated.h2>{data?.total?.deaths || '0'}</animated.h2>
        <h5>{t('Administered')}</h5>
        <animated.h2>{data?.vaccine?.administered || '0'}</animated.h2>
        <h5>{t('People vaccinated')}</h5>
        <animated.h2>{data?.vaccine?.people_vaccinated || '0'}</animated.h2>
        <h5>{t('People partially vaccinated')}</h5>
        <animated.h2>{data?.vaccine?.people_partially_vaccinated || '0'}</animated.h2>
      </div>
    </div>
  );
}

export default memo(StateHeader);
