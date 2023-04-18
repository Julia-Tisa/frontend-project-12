import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { Button, Navbar, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { io } from 'socket.io-client';
import leoProfanity from 'leo-profanity';
import { Page404 } from './components/Page404.jsx';
import { PageForm } from './components/PageForm.jsx';
import { PageChat } from './components/PageChat.jsx';
import { PageRegistration } from './components/PageRegistration.jsx';
import { AuthContext, SocketContext } from './contexts/index.jsx';
import { useAuth } from './hooks/index.jsx';
import { actions } from './slices/index.js';

const {
  addMessage,
  addChannel,
  setCurrentChannel,
  removeChannel,
  renameChannel,
} = actions;

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const savedUserData = JSON.parse(localStorage.getItem('userId'));
  const [user, setUser] = useState(
    savedUserData ? { username: savedUserData.username } : null,
  );

  const logIn = useCallback((user) => {
    setLoggedIn(true);
    setUser({ username: user.username });
  }, []);

  const logOut = useCallback(() => {
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    setUser(null);
    setLoggedIn(false);
  }, []);

  const providerValue = useMemo(
    () => ({
      loggedIn,
      logIn,
      logOut,
      user,
    }),
    [loggedIn, logIn, logOut, user],
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
    auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const AuthButton = () => {
  const auth = useAuth();
  const { t } = useTranslation();
  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>{t('buttons.exit')}</Button>
      : null
  );
};

function App() {
  const { t } = useTranslation();
  const webSocket = io();
  const dispatch = useDispatch();

  const ru = leoProfanity.getDictionary('ru');
  const en = leoProfanity.getDictionary('en');
  leoProfanity.add(ru, en);

  webSocket.on('newMessage', (payload) => {
    dispatch(addMessage(payload));
  });
  webSocket.on('newChannel', (payload) => {
    dispatch(addChannel(payload));
  });
  webSocket.on('removeChannel', (payload) => {
    dispatch(removeChannel(payload.id));
  });
  webSocket.on('renameChannel', (payload) => {
    dispatch(renameChannel(payload));
  });

  const sendMessage = useCallback((...args) => webSocket.emit('newMessage', ...args), [webSocket]);
  const newChannel = useCallback((name, cb) => {
    webSocket.emit('newChannel', { name }, (response) => {
      const { status, data: { id } } = response;

      if (status === 'ok') {
        dispatch(setCurrentChannel({ id }));
        cb();
        return response.data;
      }
      return status;
    });
  }, [dispatch, webSocket]);
  const removingChannel = useCallback((id, cb) => {
    webSocket.emit('removeChannel', id, (response) => {
      const { status } = response;
      if (status === 'ok') {
        dispatch(removeChannel(id));
        cb();
      }
      return status;
    });
  }, [dispatch, webSocket]);
  const renamingChannel = useCallback(({ id, name }, cb) => {
    webSocket.emit('renameChannel', { id, name }, (response) => {
      const { status } = response;
      if (status === 'ok') {
        dispatch(renameChannel({ id, name }));
        cb();
      }
      return status;
    });
  }, [dispatch, webSocket]);

  const webSocketValue = useMemo(
    () => ({
      sendMessage,
      newChannel,
      removingChannel,
      renamingChannel
    }),
    [sendMessage, newChannel, removingChannel, renamingChannel],
  );

  return (
    <SocketContext.Provider value={webSocketValue}>
    <AuthProvider>
    <div className="d-flex flex-column h-100">
      <Router>
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/">{t('headers.logo')}</Navbar.Brand>
          <AuthButton />
        </Container>
      </Navbar>
          <Routes>
            <Route path='*' element={<Page404 />} />
            <Route path="/login" element={<PageForm />} />
            <Route path='/signup' element={<PageRegistration />} />
            <Route path='/' element={(
                <PrivateRoute>
                  <PageChat />
                </PrivateRoute>
              )} />
          </Routes>
          <ToastContainer />
      </Router>
      </div>
    </AuthProvider>
    </SocketContext.Provider>
  );
}

export default App;
