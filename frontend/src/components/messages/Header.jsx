import React from 'react';
import { useTranslation } from 'react-i18next';

const Header = ({ messagesCount, currentChannel }) => {
  const { t } = useTranslation();
  return (
    <div className="border-bottom bg-light shadow-sm small p-3">
      <p className="m-0">
        <b>
          <span className="rounded px-1 me-1 fw-light small">#</span>
          {currentChannel ? currentChannel.name : null}
        </b>
      </p>
      <p className="text-muted m-0">
        {t('messages.messagesCount', { count: messagesCount })}
      </p>
    </div>
  );
};

export default Header;
