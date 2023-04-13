import SendingWindow from './Form.jsx';
import Header from './Header.jsx';

const MainComponent = () => {
  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <Header />
        <div id="messages-box" className="chat-messages overflow-auto px-5">
          <SendingWindow />
        </div>
      </div>
    </div>
  );
};

export default MainComponent;