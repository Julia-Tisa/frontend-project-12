import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { I18nextProvider, initReactI18next } from 'react-i18next';
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
  setCurrentChannel,
  removeChannel,
  renameChannel,
} = actions;

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
        resolve(response);
      }
      reject();
    });
  });

  const sendMessage = async (...args) => {
    await promisify('newMessage', ...args);
  };

  const newChannel = async (name) => {
    const response = await promisify('newChannel', { name });
    const { data: { id } } = response;
    store.dispatch(setCurrentChannel({ id }));
  };

  const removingChannel = async (id) => {
    await promisify('removeChannel', id);
    store.dispatch(removeChannel(id));
  };

  const renamingChannel = async ({ id, name }) => {
    await promisify('renameChannel', { id, name });
    store.dispatch(renameChannel({ id, name }));
  };

  const webSocketValue = {
    sendMessage,
    newChannel,
    removingChannel,
    renamingChannel,
  };

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ApiContext.Provider value={webSocketValue}>
          <App />
        </ApiContext.Provider>
      </I18nextProvider>
    </Provider>
  );
};

export default init;
