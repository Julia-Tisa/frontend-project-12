import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BsPlusSquare } from 'react-icons/bs';
import { Nav, Button, Dropdown, ButtonGroup } from 'react-bootstrap';
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
      <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
        <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
          <span>{t('channels.channels')}</span>
          <Button variant="light" className="p-0 text-primary btn btn-group-vertical" onClick={() => openModal('add')}>
            <BsPlusSquare />
            <span className="visually-hidden">+</span>
          </Button>
        </div>
      <Nav
        as="ul"
        className="flex-column nav-pills nav-fill px-2"
        id="channels-box"
        activeKey={currentChannelId}
      >
        {
          channels.map((channel) => {
            const { id, name, removable } = channel;
            if (removable) {
              return (
                <Nav.Item key={id} className="w-100" as="li">
                  <Dropdown className="d-flex btn-group" as={ButtonGroup}>
                    <Button
                      variant={id === currentChannelId ? 'secondary' : 'light'}
                      className="w-100 rounded-0 text-start"
                      onClick={() => handleClick(id)}
                    >
                      <span className="me-1">#</span>
                      {name}
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
                className="w-100 rounded-0 text-start"
                onClick={() => handleClick(id)}
              >
                <span className="me-1">#</span>
                {name}
              </Button>
            </Nav.Item>
            );
          })
        }
      </Nav>
    </div>
    {modalWindow({ modalInfo, closeModal })}
    </>
  );
};

export default Channels;