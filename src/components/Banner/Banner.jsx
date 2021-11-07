import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';
import { BiInfoCircle } from 'react-icons/bi';
import { Link } from 'react-router-dom';

import {
  selectNetflixMovies,
  selectTrendingMovies,
} from '../../redux/movies/movies.selectors';
import { selectNetflixSeries } from '../../redux/series/series.selectors';
import { randomize, truncate } from '../../utils';
import { showModalDetail } from '../../redux/modal/modal.actions';
import {
  staggerOne,
  bannerFadeInLoadSectionVariants,
  bannerFadeInVariants,
  bannerFadeInUpVariants,
} from '../../motionUtils';
import { BASE_IMG_URL } from '../../requests';
import SkeletonBanner from '../SkeletonBanner/SkeletonBanner';

import './banner.scss';

const Banner = ({ type }) => {
  let selector;
  switch (type) {
    case 'movies':
      selector = selectTrendingMovies;
      break;
    case 'series':
      selector = selectNetflixSeries;
      break;
    default:
      selector = selectNetflixMovies;
      break;
  }

  const myData = useSelector(selector);
  const { loading, error, data: results } = myData;
  const finalData = results[randomize(results)];
  const fallbackTitle =
    finalData?.title || finalData?.name || finalData?.original_name;
  const description = truncate(finalData?.overview, 150);
  const dispatch = useDispatch();

  const handlePlayAnimation = (event) => {
    event.stopPropagation();
  };

  const handleModalOpening = () => {
    dispatch(showModalDetail({ ...finalData, fallbackTitle }));
  };

  return (
    <>
      <motion.section
        variants={bannerFadeInLoadSectionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="Banner__loadsection"
      >
        {loading && <SkeletonBanner />}
        {error && <div className="errored">Oops, an error occurred</div>}
      </motion.section>
      {!loading && finalData && (
        <motion.header
          variants={bannerFadeInVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="Banner"
          style={{
            backgroundImage: `url(${BASE_IMG_URL}/${finalData?.backdrop_path})`,
          }}
        >
          <motion.div
            className="Banner__content"
            variants={staggerOne}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.h1
              variants={bannerFadeInUpVariants}
              className="Banner__content--title"
            >
              {fallbackTitle}
            </motion.h1>
            <motion.div
              variants={bannerFadeInUpVariants}
              className="Banner__buttons"
            >
              <Link
                className="Banner__button"
                onClick={handlePlayAnimation}
                to={'/play'}
              >
                <FaPlay />
                <span>Play</span>
              </Link>
              <button className="Banner__button" onClick={handleModalOpening}>
                <BiInfoCircle />
                <span>More Info</span>
              </button>
            </motion.div>
            <motion.p
              variants={bannerFadeInUpVariants}
              className="Banner__content--description"
            >
              {description}
            </motion.p>
          </motion.div>
          <div className="Banner__panel" />
          <div className="Banner__bottom-shadow" />
        </motion.header>
      )}
    </>
  );
};

export default React.memo(Banner);
