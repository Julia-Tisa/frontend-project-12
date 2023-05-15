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

  const sendMessage = (...args) => webSocket.emit('newMessage', ...args);
  const newChannel = (name, cb) => {
    webSocket.emit('newChannel', { name }, (response) => {
      const { status, data: { id } } = response;

      if (status === 'ok') {
        store.dispatch(setCurrentChannel({ id }));
        cb();
        return response.data;
      }
      return status;
    });
  };
  const removingChannel = (id, cb) => {
    webSocket.emit('removeChannel', id, (response) => {
      const { status } = response;
      if (status === 'ok') {
        store.dispatch(removeChannel(id));
        cb();
      }
      return status;
    });
  };
  const renamingChannel = ({ id, name }, cb) => {
    webSocket.emit('renameChannel', { id, name }, (response) => {
      const { status } = response;
      if (status === 'ok') {
        store.dispatch(renameChannel({ id, name }));
        cb();
      }
      return status;
    });
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
