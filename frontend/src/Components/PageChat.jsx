import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Channels from './Channels.jsx';
import Messages from './messages/MainComponent';
import { actions } from '../slices/index.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const BuildPage = () => {
  const dispatch = useDispatch();
  const channelsInfo = useSelector((s) => s)

  useEffect(() => {
    const getData = async () => {
      const authHeader = await getAuthHeader();
      dispatch(actions.getData(authHeader));    
    }

    getData();
  }, [dispatch])

  if (channelsInfo.loading) {
    return <h1>Loading...</h1>;
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
  
  export const PageChat = () => BuildPage();