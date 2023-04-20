import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BsPlusSquare } from 'react-icons/bs';
import {
  Nav, Button, Dropdown, ButtonGroup, Col,
} from 'react-bootstrap';
import { actions } from '../slices/index.js';
import selectedModal from './modals/index.js';

const modalWindow = ({ modalInfo, closeModal }) => {
  if (!modalInfo.type) {
    return null;
  }

  const ModalComponent = selectedModal(modalInfo.type);
  return <ModalComponent modalInfo={modalInfo} onHide={closeModal} />;
};

const Channels = () => {
  const { t } = useTranslation();
  const [modalInfo, setModalInfo] = useState({ type: null, channel: null });
  const { channels, currentChannelId } = useSelector((s) => s.channelsInfo);
  const dispatch = useDispatch();

  const handleClick = (id) => {
    dispatch(actions.setCurrentChannel({ id }));
  };

  const openModal = (type, channel = null) => setModalInfo({ type, channel });
  const closeModal = () => setModalInfo({ type: null, channel: null });

  return (
    <>
      <Col xs={4} md={3} className="border-end p-0 bg-light d-flex flex-column">
        <div className="ps-3 pe-2 pt-5 pb-2 d-flex justify-content-between align-items-center">
          <div className="text-truncate"><b>{t('channels.channels')}</b></div>
          <Button variant="primary" className="p-1 d-flex align-items-center" onClick={() => openModal('add')}>
            <BsPlusSquare />
            <span className="visually-hidden">+</span>
          </Button>
        </div>
        <Nav
          as="ul"
          className="nav-pills nav-fill p-2 overflow-auto h-100 d-block"
          id="channels-box"
          activeKey={currentChannelId}
        >
          {
          channels.map((channel) => {
            const { id, name, removable } = channel;
            if (removable) {
              return (
                <Nav.Item key={id} className="w-100 my-1" as="li">
                  <Dropdown className="d-flex" as={ButtonGroup}>
                    <Button
                      variant={id === currentChannelId ? 'secondary' : 'light'}
                      className="text-truncate text-start w-100 border-0 py-2"
                      onClick={() => handleClick(id)}
                    >
                      <div className="me-auto text-truncate">
                        <span className="rounded px-1 me-1 fw-light small">#</span>
                        {name}
                      </div>
                    </Button>
                    <Dropdown.Toggle variant={id === currentChannelId ? 'secondary' : 'light'}>
                      <span className="visually-hidden">{t('channels.manage')}</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => openModal('remove', channel)}>
                        {t('channels.remove')}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => openModal('rename', channel)}>
                        {t('channels.rename')}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav.Item>
              );
            }
            return (
              <Nav.Item className="w-100" key={id} as="li">
                <Button
                  variant={id === currentChannelId ? 'secondary' : 'light'}
                  className="text-start w-100 border-0 pe-2 py-2 d-flex align-items-center"
                  onClick={() => handleClick(id)}
                >
                  <div className="me-auto text-truncate">
                    <span className="rounded px-1 me-1 fw-light small">#</span>
                    {name}
                  </div>
                </Button>
              </Nav.Item>
            );
          })
        }
        </Nav>
      </Col>
      {modalWindow({ modalInfo, closeModal })}
    </>
  );
};

export default Channels;
