
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import App from './App.jsx';

import reducer from './slices/index.js';

const init = async () => {

  const store = configureStore({
    reducer,
  });

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default init;