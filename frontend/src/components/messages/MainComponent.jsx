import React from 'react';
import { useSelector } from 'react-redux';
import { Col } from 'react-bootstrap';
import SendingWindow from './SendingWindow.jsx';
import Header from './Header.jsx';
import Message from './Message.jsx';

const MainComponent = () => {
  const { channels, currentChannelId } = useSelector((s) => s.channelsInfo);
  const messages = useSelector((s) => s.messagesInfo.messages);

  const currentChannel = channels
    .find(({ id }) => id === currentChannelId);

  const currentMessages = messages
    .filter((message) => message.channelId === currentChannelId);

  return (
    <Col className="p-0 h-100">
      <div className="d-flex flex-column h-100">
        <Header
          messagesCount={currentMessages.length}
          currentChannel={currentChannel}
        />
        <div id="messages-box" className="chat-messages overflow-auto px-5">
          {currentMessages.map((message) => (
            <Message message={message} key={message.id} />
          ))}
        </div>
        <SendingWindow currentChannel={currentChannel} />
      </div>
    </Col>
  );
};

export default MainComponent;
