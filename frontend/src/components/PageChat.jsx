import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Channels from './Channels.jsx';
import Messages from './messages/MainComponent.jsx';
import { actions } from '../slices/index.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const PageChat = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channelsInfo = useSelector((s) => s);

  useEffect(() => {
    const notifay = () => toast.error(t('toast.error'));
    const getData = async () => {
      const authHeader = await getAuthHeader();
      dispatch(actions.getData(authHeader)).catch(() => {
        notifay();
      });
    };

    getData();
  }, [dispatch, t]);

  if (channelsInfo.loading) {
    return (
      <Container className="h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <h1>{t('loading')}</h1>
        </div>
      </Container>
    );
  }

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <Channels />
        <Messages />
      </div>
    </Container>
  );
};

export default PageChat;
