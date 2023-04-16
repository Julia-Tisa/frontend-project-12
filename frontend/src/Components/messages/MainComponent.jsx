import React from 'react';
import { useSelector } from 'react-redux';
import { Col } from 'react-bootstrap';
import SendingWindow from './SendingWindow.jsx';
import Header from './Header.jsx';
import Message from './Message.jsx'; 

const MainComponent = () => {
  const messages = useSelector((s) => s.messagesInfo.messages);

  return (
    <Col className="p-0 h-100">
      <div className="d-flex flex-column h-100">
        <Header
        messagesCount={messages.length} />
        <div id="messages-box" className="chat-messages overflow-auto px-5">
        {messages.map((message) => (
            <Message message={message} key={message.id} />
          ))}
        </div>
        <SendingWindow />
      </div>
    </Col>
  );
};

export default MainComponent;