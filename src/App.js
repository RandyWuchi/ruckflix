import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Auth from './pages/Auth/Auth';
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import Movies from './pages/Movies/Movies';
import TVSeries from './pages/TVSeries/TVSeries';
import Popular from './pages/Popular/Popular';
import MyList from './pages/MyList/MyList';
import Category from './pages/Category/Category';
import Navbar from './components/Navbar/Navbar';
import DetailModal from './components/DetailModal/DetailModal';
import PlayAnimation from './components/PlayAnimation/PlayAnimation';
import SplashAnimation from './components/SplashAnimation/SplashAnimation';
import { checkUserSession } from './redux/auth/auth.actions';
import { selectCurrentUser } from './redux/auth/auth.selectors';
import { selectSearchResults } from './redux/search/search.selectors';

function App() {
  const currentUser = useSelector(selectCurrentUser);
  const searchResults = useSelector(selectSearchResults);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(checkUserSession());
  }, [dispatch]);

  return (
    <div className="App">
      {currentUser && (
        <>
          <Navbar />
          <DetailModal />
        </>
      )}
      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.pathname}>
          <Route exact path="/">
            <Redirect to="login" />
          </Route>
          <Route path="/splash" component={SplashAnimation} />
          <Route path="/play" component={PlayAnimation} />
          <Route
            path="/search"
            render={() =>
              currentUser ? (
                searchResults && <Search results={searchResults} />
              ) : (
                <Redirect to="login" />
              )
            }
          />
          <Route
            exact
            path="/browse"
            render={() => (currentUser ? <Home /> : <Redirect to="login" />)}
          />
          <Route
            exact
            path="/browse/:categoryName"
            render={(props) =>
              currentUser ? <Category {...props} /> : <Redirect to="login" />
            }
          />
          <Route
            exact
            path="/browse/:categoryName"
            render={(props) =>
              currentUser ? <Category {...props} /> : <Redirect to="/login" />
            }
          />
          <Route
            exact
            path="/tvseries"
            render={() =>
              currentUser ? <TVSeries /> : <Redirect to="/login" />
            }
          />
          <Route
            exact
            path="/tvseries/:categoryName"
            render={(props) =>
              currentUser ? <Category {...props} /> : <Redirect to="/login" />
            }
          />
          <Route
            exact
            path="/movies"
            render={() => (currentUser ? <Movies /> : <Redirect to="/login" />)}
          />
          <Route
            exact
            path="/movies/:categoryName"
            render={(props) =>
              currentUser ? <Category {...props} /> : <Redirect to="/login" />
            }
          />
          <Route
            exact
            path="/popular"
            render={() =>
              currentUser ? <Popular /> : <Redirect to="/login" />
            }
          />
          <Route
            exact
            path="/popular/:categoryName"
            render={(props) =>
              currentUser ? <Category {...props} /> : <Redirect to="/login" />
            }
          />
          <Route
            exact
            path="/mylist"
            render={() => (currentUser ? <MyList /> : <Redirect to="/login" />)}
          />
          <Route
            exact
            path="/login"
            render={() => (currentUser ? <Redirect to="/splash" /> : <Auth />)}
          />
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </AnimatePresence>
    </div>
  );
}

export default App;
