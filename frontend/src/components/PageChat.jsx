import React, { useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Channels from './Channels.jsx';
import Messages from './messages/MainComponent.jsx';
import { actions } from '../slices/index.js';
import { useAuth } from '../hooks/index.jsx';

const PageChat = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const auth = useAuth();
  const channelsInfo = useSelector((s) => s);

  useEffect(() => {
    const getData = async () => {
      const authHeader = auth.getAuthHeader();
      dispatch(actions.getData(authHeader)).catch((err) => {
        if (err.isAxiosError && err.response.status === 401) {
          auth.logOut();
          return;
        }
        if (err.isAxiosError) {
          toast.error(t('toast.error'));
          return;
        }
        toast.error(t('toast.unknownError'));
      });
    };

    getData();
  }, [auth, dispatch, t]);

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
      <Row className="h-100 bg-white flex-md-row">
        <Channels />
        <Messages />
      </Row>
    </Container>
  );
};

export default PageChat;
