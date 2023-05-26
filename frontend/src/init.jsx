import React from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Provider as ErrorProvider, ErrorBoundary } from '@rollbar/react';
import { configureStore } from '@reduxjs/toolkit';
import i18next from 'i18next';
import { io } from 'socket.io-client';
import leoProfanity from 'leo-profanity';
import App from './App.jsx';
import { ApiContext } from './contexts/index.jsx';
import reducer, { actions } from './slices/index.js';
import resources from './locales/resources.js';

const {
  addMessage,
  addChannel,
  removeChannel,
  renameChannel,
} = actions;

const rollbarConfig = {
  accessToken: process.env.ROLLBAR_TOKEN,
  environment: 'production',
};

const init = async () => {
  const store = configureStore({
    reducer,
  });

  const i18n = i18next.createInstance();
  await i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'ru',
  });

  const ru = leoProfanity.getDictionary('ru');
  const en = leoProfanity.getDictionary('en');
  leoProfanity.add(ru, en);

  const webSocket = io();

  webSocket.on('newMessage', (payload) => {
    store.dispatch(addMessage(payload));
  });
  webSocket.on('newChannel', (payload) => {
    store.dispatch(addChannel(payload));
  });
  webSocket.on('removeChannel', (payload) => {
    store.dispatch(removeChannel(payload.id));
  });
  webSocket.on('renameChannel', (payload) => {
    store.dispatch(renameChannel(payload));
  });

  const promisify = (...args) => new Promise((resolve, reject) => {
    webSocket.emit(...args, (response) => {
      const { status } = response;
      if (status === 'ok') {
        resolve(response.data);
      }
      reject();
    });
  });

  const sendMessage = (...args) => promisify('newMessage', ...args);

  const newChannel = (name) => promisify('newChannel', { name });

  const removingChannel = (id) => promisify('removeChannel', id);

  const renamingChannel = ({ id, name }) => promisify('renameChannel', { id, name });

  const webSocketValue = {
    sendMessage,
    newChannel,
    removingChannel,
    renamingChannel,
  };

  return (
    <ErrorProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <ApiContext.Provider value={webSocketValue}>
              <App />
            </ApiContext.Provider>
          </I18nextProvider>
        </Provider>
      </ErrorBoundary>
    </ErrorProvider>
  );
};

export default init;
