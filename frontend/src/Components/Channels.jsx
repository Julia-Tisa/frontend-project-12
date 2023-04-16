import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BsPlusSquare } from 'react-icons/bs';
import { Nav, Button } from 'react-bootstrap';

const Channels = () => {
  const { channels, currentChannelId } = useSelector((s) => s.channelsInfo);

  const handleClick = (id) => {
    console.log({ id });
  };

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <span>Channels</span>
        <button type="button" className="p-0 text-primary btn btn-group-vertical">
          <BsPlusSquare />
          <span className="visually-hidden">+</span>
          </button>
      </div>
      <Nav
        as="ul"
        className="flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
        id="channels-box"
        activeKey={currentChannelId}
      >
         {
          channels.map((channel) => (
            <Nav.Item className="w-100" key={channel.id} as="li">
              <Button
                variant={channel.id === currentChannelId ? 'secondary' : 'light'}
                className="w-100 rounded-0 text-start"
                onClick={() => handleClick(channel.id)}
              >
                <span className="me-1">#</span>
                {channel.name}
              </Button>
            </Nav.Item>
          ))
        }
      </Nav>
    </div>
  );
};

export default Channels;