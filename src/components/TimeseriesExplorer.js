import TimeseriesLoader from './loaders/Timeseries';

import {
  STATE_NAMES,
  STATISTIC_CONFIGS,
  TIMESERIES_CHART_TYPES,
  TIMESERIES_LOOKBACK_DAYS,
  TIMESERIES_STATISTICS,
} from '../constants';
import useIsVisible from '../hooks/useIsVisible';
import {
  getdungndDateYesterdayISO,
  parsedungndDate,
  retry,
} from '../utils/commonFunctions';

import {PinIcon, ReplyIcon} from '@primer/octicons-react';
import classnames from 'classnames';
import {min} from 'd3-array';
import {formatISO, subDays} from 'date-fns';
import equal from 'fast-deep-equal';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  lazy,
  Suspense,
} from 'react';
const Level = lazy(() => retry(() => import('./Level')));

function TimeseriesExplorer({
  deathHistory,
  confirmHistory,
  anchor,
  expandTable = false,
}) {
  const [dropdownRegions, setDropdownRegions] = useState([
    '2021-06-18',
    '2021-06-19',
    '2021-06-20',
    '2021-06-21',
    '2021-06-22',
    '2021-06-23',
    '2021-06-24',
  ]);
  const [selectedRegion, setSelectedRegion] = useState('2021-06-24');
  const [data, setData] = useState({});
  useEffect(() => {}, []);
  const handleChange = (e) => {
    setSelectedRegion(e.target.value);
  };
  const explorerElement = useRef();

  const sumAll = (obj, key) => {
    let total = 0;
    Object.keys(obj).forEach((item) => {
      total += obj[item]['All']['dates'][key];
    });
    return total;
  };

  const manipulateData = () => {
    const tempData = {
      total: {
        confirmed: 0,
        deaths: 0,
      },
    };
    if (deathHistory) {
      tempData.total.deaths = sumAll(deathHistory, selectedRegion);
    }
    if (confirmHistory) {
      tempData.total.confirmed = sumAll(confirmHistory, selectedRegion);
    }
    setData(tempData);
  };

  useEffect(() => {
    manipulateData();
  }, [selectedRegion]);

  useEffect(() => {
    manipulateData();
  }, [confirmHistory, deathHistory]);

  return (
    <div
      className={classnames(
        'TimeseriesExplorer fadeInUp',
        {
          stickied: anchor === 'timeseries',
        },
        {expanded: expandTable}
      )}
      style={{
        display:
          anchor && anchor !== 'timeseries' && (!expandTable || width < 769)
            ? 'none'
            : '',
      }}
      ref={explorerElement}
    >
      <div className="timeseries-header">
        <h1>Historical</h1>
      </div>

      <div className="state-selection">
        <div className="dropdown">
          <select value={selectedRegion} onChange={handleChange}>
            {dropdownRegions.map((region) => {
              return (
                <option value={region} key={`${region}`}>
                  {region}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div style={{position: 'relative', marginTop: '1rem'}}>
        <Suspense fallback={<div style={{height: '50rem'}} />}>
          <Level data={data} />
        </Suspense>
      </div>
    </div>
  );
}

export default TimeseriesExplorer;
