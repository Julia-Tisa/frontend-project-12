import React, { useState, useCallback, useMemo } from 'react';
import {
  BrowserRouter as Router, Routes, Route, useLocation, Navigate, Link,
} from 'react-router-dom';
import { Button, Navbar, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import { Provider, ErrorBoundary } from '@rollbar/react';
import 'react-toastify/dist/ReactToastify.css';
import Page404 from './components/Page404.jsx';
import PageForm from './components/PageForm.jsx';
import PageChat from './components/PageChat.jsx';
import PageRegistration from './components/PageRegistration.jsx';
import { AuthContext } from './contexts/index.jsx';
import { useAuth } from './hooks/index.jsx';
import routes from './routes.js';

const rollbarConfig = {
  accessToken: process.env.ROLLBAR_TOKEN,
  environment: 'production',
};

const AuthProvider = ({ children }) => {
  const savedUserData = JSON.parse(localStorage.getItem('userId'));
  const [user, setUser] = useState(
    savedUserData ? { username: savedUserData.username } : null,
  );

  const logIn = useCallback((human) => {
    setUser({ username: human.username });
  }, []);

  const logOut = useCallback(() => {
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    setUser(null);
  }, []);

  const getAuthHeader = useCallback(() => {
    const userId = JSON.parse(localStorage.getItem('userId'));

    if (userId && userId.token) {
      return { Authorization: `Bearer ${userId.token}` };
    }
    return {};
  }, []);

  const providerValue = useMemo(
    () => ({
      logIn,
      logOut,
      user,
      getAuthHeader,
    }),
    [logIn, logOut, user, getAuthHeader],
  );

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.user ? children : <Navigate to={routes.pageFormPath()} state={{ from: location }} />
  );
};

const AuthButton = () => {
  const auth = useAuth();
  const { t } = useTranslation();
  return (
    auth.user
      ? <Button onClick={auth.logOut}>{t('buttons.exit')}</Button>
      : null
  );
};

const App = () => {
  const { t } = useTranslation();

  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <AuthProvider>
          <div className="d-flex flex-column h-100">
            <Router>
              <Navbar bg="white" expand="lg" className="shadow-sm">
                <Container>
                  <Navbar.Brand as={Link} to={routes.pageChatPath()}>{t('headers.logo')}</Navbar.Brand>
                  <AuthButton />
                </Container>
              </Navbar>
              <Routes>
                <Route path={routes.page404Path()} element={<Page404 />} />
                <Route path={routes.pageFormPath()} element={<PageForm />} />
                <Route path={routes.pageRegistrationPath()} element={<PageRegistration />} />
                <Route
                  path={routes.pageChatPath()}
                  element={(
                    <PrivateRoute>
                      <PageChat />
                    </PrivateRoute>
                    )}
                />
              </Routes>
              <ToastContainer />
            </Router>
          </div>
        </AuthProvider>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
