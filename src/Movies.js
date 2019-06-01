import React, { Fragment } from "react";
import PropTypes from "prop-types";

const Movies = ({ movies, addToQueue }) => (
  <Fragment>
    <h1>Available Movies</h1>
    <ul className="movie__list">
      {movies &&
        movies.map(movie => (
          <li key={movie.id}>
            {movie.id}
            <button className="button" onClick={() => addToQueue(movie.id)}>
              +
            </button>
          </li>
        ))}
    </ul>
  </Fragment>
);

Movies.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      poster: PropTypes.string,
      releaseDate: PropTypes.string
    })
  )
};

Movies.defaultProps = {
  movies: []
};

export default Movies;
