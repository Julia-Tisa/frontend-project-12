import React, { useCallback, useMemo } from 'react';
import { Provider, useDispatch } from 'react-redux';
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

const SocketApiProvider = ({ children }) => {
  const webSocket = io();
  const dispatch = useDispatch();

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
      renamingChannel,
    }),
    [sendMessage, newChannel, removingChannel, renamingChannel],
  );

  return (
    <ApiContext.Provider value={webSocketValue}>
      {children}
    </ApiContext.Provider>
  );
};

const Init = async () => {
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

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <SocketApiProvider>
          <App />
        </SocketApiProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default Init;
