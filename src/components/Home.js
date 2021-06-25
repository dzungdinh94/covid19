import {DATA_API_ROOT, DATA_API_ROOT_VER2} from '../constants';
import useIsVisible from '../hooks/useIsVisible';
import useStickySWR from '../hooks/useStickySWR';
import {fetcher, retry} from '../utils/commonFunctions';
import * as Icon from 'react-feather';

import classnames from 'classnames';
import {useMemo, useRef, useState, lazy, Suspense, useEffect} from 'react';
import {Helmet} from 'react-helmet';
import {useLocation} from 'react-router-dom';
import {useLocalStorage, useSessionStorage, useWindowSize} from 'react-use';
import {useDebounce, useKeyPressEvent, useUpdateEffect} from 'react-use';
import {useCallback} from 'react';

const Footer = lazy(() => retry(() => import('./Footer')));
const Level = lazy(() => retry(() => import('./Level')));

const StateHeader = lazy(() => retry(() => import('./StateHeader')));
const TimeseriesExplorer = lazy(() =>
  retry(() => import('./TimeseriesExplorer'))
);

function Home() {
  const [anchor, setAnchor] = useLocalStorage('anchor', null);
  const [expandTable, setExpandTable] = useLocalStorage('expandTable', false);
  const [searchValue, setSearchValue] = useState('');

  const [date, setDate] = useState('');
  const location = useLocation();
  const [vietnam, setVietnam] = useState({});
  const [vaccine, setVaccine] = useState({});

  const {data: vietnamData} = useStickySWR(
    `${DATA_API_ROOT_VER2}/cases?country=Vietnam`,
    fetcher,
    {
      revalidateOnMount: true,
      refreshInterval: 100000,
    }
  );

  const {data: vaccineData} = useStickySWR(
    `${DATA_API_ROOT_VER2}/vaccines?country=Vietnam`,
    fetcher,
    {
      revalidateOnMount: true,
      refreshInterval: 100000,
    }
  );

  const {data: historyDeathV2} = useStickySWR(
    `${DATA_API_ROOT_VER2}/history?status=deaths`,
    fetcher,
    {
      revalidateOnMount: true,
      refreshInterval: 100000,
    }
  );

  const {data: historyConfirmV2} = useStickySWR(
    `${DATA_API_ROOT_VER2}/history?status=confirmed`,
    fetcher,
    {
      revalidateOnMount: true,
      refreshInterval: 100000,
    }
  );

  const [confirmHistory, setConfirmHistory] = useState({});
  const [deathHistory, setDeathHistory] = useState({});

  useEffect(() => {
    if (vietnamData) {
      console.log(vietnamData);
      const tempData = {
        total: {
          confirmed: vietnamData.All.confirmed,
          recovered: vietnamData.All.recovered,
          deaths: vietnamData.All.deaths,
          mortality_rate:
            (vietnamData.All.deaths / vietnamData.All.confirmed) * 100,
        },
      };
      setVietnam(tempData);
    }
  }, [vietnamData]);

  useEffect(() => {
    if (vaccineData) {
      const tempData = {
        vaccine: {
          administered: vaccineData.All.administered,
          people_vaccinated: vaccineData.All.people_vaccinated,
          people_partially_vaccinated:
            vaccineData.All.people_partially_vaccinated,
        },
      };
      setVaccine(tempData);
    }
  }, [vaccineData]);

  useEffect(() => {
    if (historyConfirmV2) {
      setConfirmHistory(historyConfirmV2);
    }
    if (historyDeathV2) {
      setDeathHistory(historyDeathV2);
    }
  }, [historyConfirmV2, historyDeathV2]);

  const sumAll = (obj, key) => {
    let total = 0;
    Object.keys(obj).forEach((item) => {
      total += obj[item]['All'][key];
    });
    return total;
  };
  const [infoData, setInfoData] = useState({});
  const refactorData = (timeseriesV2) => {
    const tempData = {
      total: {
        confirmed:
          searchValue.length > 0
            ? timeseriesV2.All.confirmed
            : sumAll(timeseriesV2, 'confirmed'),
        recovered:
          searchValue.length > 0
            ? timeseriesV2.All.recovered
            : sumAll(timeseriesV2, 'recovered'),
        deaths:
          searchValue.length > 0
            ? timeseriesV2.All.deaths
            : sumAll(timeseriesV2, 'deaths'),
        mortality_rate:
          (searchValue.length > 0
            ? timeseriesV2.All?.deaths
            : sumAll(timeseriesV2, 'deaths') / searchValue.length > 0
            ? timeseriesV2.All?.confirmed
            : sumAll(timeseriesV2, 'confirmed')) * 100,
      },
    };
    setInfoData(tempData);
  };
  const {data: timeseriesV2} = useStickySWR(
    `${DATA_API_ROOT_VER2}/cases?country=${searchValue}`,
    fetcher,
    {
      revalidateOnMount: true,
      refreshInterval: 100000,
    }
  );
  useEffect(() => {
    if (timeseriesV2) {
      refactorData(timeseriesV2);
    }
  }, [timeseriesV2]);

  const homeRightElement = useRef();
  const isVisible = useIsVisible(homeRightElement);
  const {width} = useWindowSize();

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

  // useDebounce(
  //   () => {
  //     if (searchValue) {
  //       // handleSearch(searchValue);
  //     }
  //   },
  //   100,
  //   [searchValue]
  // );

  const handleClose = useCallback(() => {
    setSearchValue('');
  }, []);

  const handleChange = useCallback((event) => {
    setSearchValue(event.target.value);
  }, []);

  useKeyPressEvent('/', () => {
    searchInput.current.focus();
  });

  useKeyPressEvent('Escape', () => {
    handleClose();
    searchInput.current.blur();
  });
  return (
    <>
      <Helmet>
        <title>Coronavirus Outbreak in the World</title>
        <meta
          name="title"
          content="Coronavirus Outbreak in the World: Latest Map and Case Count"
        />
      </Helmet>

      <div className="Home">
        <div className={classnames('home-left', {expanded: expandTable})}>
          <div className="header">
            <Suspense fallback={<div />}>
              <div className="Search">
                <div className="search-input-wrapper fadeInUp" style={trail[2]}>
                  <input
                    type="text"
                    value={searchValue}
                    onChange={handleChange}
                  />

                  <div className={`search-button`}>
                    <Icon.Search />
                  </div>

                  {searchValue.length > 0 && (
                    <div className={`close-button`} onClick={handleClose}>
                      <Icon.X />
                    </div>
                  )}
                </div>
              </div>
            </Suspense>
          </div>

          <div style={{position: 'relative', marginTop: '1rem'}}>
            {infoData && (
              <Suspense fallback={<div style={{height: '50rem'}} />}>
                <Level data={infoData} />
              </Suspense>
            )}
          </div>
        </div>

        <div
          className={classnames('home-right', {expanded: expandTable})}
          ref={homeRightElement}
          style={{minHeight: '4rem'}}
        >
          {(isVisible || location.hash) && (
            <>
              {infoData && (
                <div
                  className={classnames('map-container', {
                    expanded: expandTable,
                    stickied:
                      anchor === 'mapexplorer' || (expandTable && width >= 769),
                  })}
                >
                  <Suspense fallback={<div style={{height: '50rem'}} />}>
                    <StateHeader data={{...vietnam, ...vaccine}} />
                  </Suspense>
                </div>
              )}

              <Suspense fallback={<div style={{height: '50rem'}} />}>
                <TimeseriesExplorer
                  deathHistory={deathHistory}
                  confirmHistory={confirmHistory}
                />
              </Suspense>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
