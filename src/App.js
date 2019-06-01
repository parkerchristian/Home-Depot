import React, {
  Fragment,
  useEffect,
  useState,
  useReducer,
  useCallback
} from "react";
import ReactDom from "react-dom";
import shortId from "shortid";

// AJAX service for getting a list of movies
import { getMovies } from "./movieService";

// Components
import Header from "./Header";
import Movies from "./Movies";
import Queue from "./Queue";
import DisclaimerFooter from "./DisclaimerFooter";

const QUEUE_STORAGE_KEY = "queue";

// getInitialState gives us the initial state
// for the queueReducer. Since we are using localStorage
// we need to check to see if anything is there first
// otherwise we just return an empty array.
const getInitialState = () => {
  let queue;
  try {
    queue = JSON.parse(localStorage.getItem(QUEUE_STORAGE_KEY));
  } catch (e) {
    console.error("Failed to parse queue", e);
  }
  return queue || [];
};

// TODO(s):
// Add in an Remove from queue case
// Add in a clear queue case
const queueReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [...state, { id: action.id, movieId: action.movieId }];
    default:
      return state;
  }
};

const App = () => {
  // React hooks useState allows functional components to hook into component state
  // useReducer is similar but follows a "redux" like reducer pattern and provides dispatch
  // to handle dispatching actions/events
  const [movies, setMovies] = useState([]);
  const [queue, dispatch] = useReducer(queueReducer, getInitialState());

  // useCallback allows us to memoize functions that need to be instantiated within
  // the render method of functions (performance increase)
  const addToQueue = useCallback(
    movieId =>
      dispatch({
        type: "ADD",
        id: shortId.generate(),
        movieId
      }),
    [dispatch]
  );

  // useEffect allows a component to perform a side effect, in realtion to
  // variables withing the scope changing, such as props. In this case, when
  // the component is first added to the DOM, we make a service call to fetch
  // the movies. Then, we simply call setMovies on the returned list of movies.
  useEffect(() => {
    getMovies().then(setMovies);

    // The second argument of useEffect, is the list of dependencies it watches to
    // know when to fire again. In this case, it has no depedencies, so it only
    // fires once.
  }, []);

  // This useEffect allows us to sync our queue reducer's state, to localStorage
  // enabling a persistance of our queue between refreshes.
  useEffect(() => {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  }, [queue]);

  // Fragments are "partial" components that can be used to wrap multiple components
  // under a single parent component, they are not rendered
  return (
    <Fragment>
      <Header />
      <Movies movies={movies} addToQueue={addToQueue} />
      <Queue queue={queue} />
      <DisclaimerFooter />
    </Fragment>
  );
};

ReactDom.render(<App />, document.getElementById("app"));
