import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NotFoundImage from '../images/404Img.jpeg';
import routes from '../routes';

const Page404 = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <img src={NotFoundImage} alt={t('pageNotFound')} className="img-fluid h-25" />
      <h1 className="h4 text-muted">{t('page404')}</h1>
      <p className="text-muted">
        {t('redirect')}
        {' '}
        <Link to={routes.pageChatPath()}>{t('pageForm')}</Link>
      </p>
    </div>
  );
};

export default Page404;
