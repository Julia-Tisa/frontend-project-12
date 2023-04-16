import React, { useState, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { Button, Navbar, Container } from 'react-bootstrap';
import { Page404 } from './components/Page404.jsx';
import { PageForm } from './components/PageForm.jsx';
import { PageChat } from './components/PageChat.jsx';
import { AuthContext, SocketContext } from './contexts/index.jsx';
import { useAuth } from './hooks/index.jsx';
import { io } from 'socket.io-client';
import { actions } from './slices/index.js';
import { useDispatch } from 'react-redux';

const { addMessage } = actions;

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
  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>Exit</Button>
      : null
  );
};

function App() {
  const webSocket = io();
  const dispatch = useDispatch();

  webSocket.on('newMessage', (payload) => {
    dispatch(addMessage(payload));
  });

  const sendMessage = useCallback((...args) => webSocket.emit('newMessage', ...args), [webSocket]);

  const webSocketValue = useMemo(
    () => ({
      sendMessage,
    }),
    [sendMessage],
  );

  return (
    <SocketContext.Provider value={webSocketValue}>
    <AuthProvider>
      <Router>
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
          <AuthButton />
        </Container>
      </Navbar>
      <div className="container p-3">
          <Routes>
            <Route path='*' element={<Page404 />} />
            <Route path="/login" element={<PageForm />} />
            <Route path='/' element={(
                <PrivateRoute>
                  <PageChat />
                </PrivateRoute>
              )} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
    </SocketContext.Provider>
  );
}

export default App;
