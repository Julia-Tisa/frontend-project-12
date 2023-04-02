import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Page404 } from './Components/Page404.jsx';
import { PageForm } from './Components/PageForm.jsx';
import { PageMain } from './Components/PageMain.jsx';
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
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<Page404 />} />
          <Route path="/login" element={<PageForm />} />
          <Route path='/' element={(
              <PrivateRoute>
                <PageMain />
              </PrivateRoute>
            )} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    
  );
}

export default App;
