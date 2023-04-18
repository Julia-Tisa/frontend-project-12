import React from 'react';
import { useTranslation } from 'react-i18next';

const Header = ({ messagesCount, currentChannel }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-light mb-4 p-3 shadow-sm small">
      <p className="m-0">
        #
        {' '}
        {currentChannel ? currentChannel.name : null}
      </p>
      <span className="text-muted">
      {t('messages.messagesCount', { count: messagesCount })}
      </span>
    </div>
  );
};

export default Header;