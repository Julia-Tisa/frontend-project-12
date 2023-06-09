import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useApi } from '../../hooks/index.jsx';
import { actions } from '../../slices/index.js';

const RemoveChannel = ({ modalInfo, onHide }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const api = useApi();
  const { currentChannelId } = useSelector((state) => state.channelsInfo);

  const { id } = modalInfo.channel;

  const onHideHandler = () => {
    onHide();
    toast.success(t('toast.remove'));
  };

  const handleSubmit = async () => {
    try {
      await api.removingChannel({ id });
      if (currentChannelId === id) {
        dispatch(actions.setCurrentChannel({ id: 1 }));
      }
      onHideHandler();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal show centered onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('channels.confirmation')}</p>
        <div className="d-flex justify-content-end">
          <Button
            variant="secondary"
            type="button"
            onClick={onHide}
            className="me-2"
          >
            {t('channels.cancel')}
          </Button>
          <Button
            variant="danger"
            type="button"
            onClick={() => handleSubmit()}
          >
            {t('channels.remove')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannel;
