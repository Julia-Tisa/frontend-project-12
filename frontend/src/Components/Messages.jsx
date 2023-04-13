import { Col } from 'react-bootstrap';

const Messages = () => {
  return (
    <Col className="p-0 h-100">
      <div className="d-flex flex-column h-100">
      <div className="bg-light mb-4 p-3 shadow-sm small">
    <p className="m-0">
      <b># random</b>
    </p>
    <span className="text-muted">0 messages</span>
  </div>
      </div>
    </Col>
  );
};

export default Messages;