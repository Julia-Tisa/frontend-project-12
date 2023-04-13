import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Nav, Button } from 'react-bootstrap';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const BuildPage = () => {
  const [channel, setChannels] = useState('');
  const [currentChannelId, setCurrentId] = useState('');
  
  const getText = async () => {
    const authHeader = await getAuthHeader();
    const response = await axios.get('api/v1/data', { headers: authHeader });
    console.log(response.data);    
  }

  useEffect(() => {
    getText();
  }, [])

  const handleClick = (id) => {
     setCurrentId(id);
  };

  const channels = JSON.parse(localStorage.getItem('Channels'));
  console.log(channels);
  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
    <div className="row h-100 bg-white flex-md-row">
    <>
      <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
        <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
          <b>Channels</b>
          <Button type="button" className="p-0 text-primary" variant="group-vertical">
            <span className="visually-hidden">+</span>
          </Button>
        </div>
        <Nav
          as="ul"
          className="flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
          id="channels-box"
          activeKey={1}
        >
                <Nav.Item className="w-100" key={1} as="li">
                  <Button
                    variant={1 === 1 ? 'secondary' : 'light'}
                    className="w-100 rounded-0 text-start"
                    onClick={() => handleClick(1)}
                  >
                    <span className="me-1">#</span>
                    {channels[0].name}
                  </Button>
                </Nav.Item>
                <Nav.Item className="w-100" key={2} as="li">
                  <Button
                    variant={2 === 1 ? 'secondary' : 'light'}
                    className="w-100 rounded-0 text-start"
                    onClick={() => handleClick(1)}
                  >
                    <span className="me-1">#</span>
                    {channels[1].name}
                  </Button>
                </Nav.Item>
        </Nav>
      </div>
    </>
    </div>
  </Container>
  )
  };
  
  export const PageChat = () => BuildPage();