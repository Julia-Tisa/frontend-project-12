import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { Button, Navbar, Container } from 'react-bootstrap';
import { Page404 } from './components/Page404.jsx';
import { PageForm } from './components/PageForm.jsx';
import { PageChat } from './components/PageChat.jsx';
import AuthContext from './contexts/index.jsx';
import useAuth from './hooks/index.jsx';


function App() {
  const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
  
    const logIn = () => setLoggedIn(true);
    const logOut = () => {
      localStorage.removeItem('userId');
      setLoggedIn(false);
    };
  
    return (
      <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
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

  return (
    <AuthProvider>
      <Router>
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
        </Container>
        <AuthButton />
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
    
  );
}

export default App;
