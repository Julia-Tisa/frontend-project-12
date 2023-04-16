import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { useSocket } from '../../hooks/index.jsx';
import { actions } from '../../slices/index.js';

const RemoveChannel = ({ modalInfo, onHide }) => {
  const dispatch = useDispatch();
  const webSocket = useSocket();
  const { currentChannelId } = useSelector((state) => state.channelsInfo);

  const { id } = modalInfo.channel;

  const handleSubmit = async () => {
    try {
      await webSocket.removingChannel({ id }, onHide);
      if (currentChannelId === id) {
        dispatch(actions.setCurrentChannel({ id: 1 }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal show centered onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Remove channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">Are you sure you want to delete this channel?</p>
        <div className="d-flex justify-content-end">
          <Button
            variant="secondary"
            type="button"
            onClick={onHide}
            className="me-2"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            type="button"
            onClick={() => handleSubmit()}
          >
            Remove
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );

};

export default RemoveChannel;
