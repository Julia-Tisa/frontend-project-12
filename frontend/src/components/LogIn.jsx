import React, { useEffect, useRef, useState } from 'react';
import {
  Button, Form, Col, Card, Row, FormLabel, Image,
} from 'react-bootstrap';
import { useNavigate, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../hooks/index.jsx';
import imageLogin from '../images/loginImg.jpeg';
import routes from '../routes.js';

const LogIn = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: yup.object().shape({
      username: yup.string()
        .min(1, t('validation.nameLengthMin'))
        .required(t('validation.required')),
      password: yup.string()
        .min(1, t('validation.passwordLengthMin'))
        .required(t('validation.required')),
    }),
    onSubmit: async (values) => {
      setAuthFailed(false);

      try {
        const res = await axios.post(routes.loginPath(), values);
        auth.logIn(res.data);
        navigate(routes.pageChatPath());
      } catch (err) {
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
          return;
        }
        if (err.isAxiosError) {
          toast.error(t('toast.error'));
          return;
        }
        toast.error(t('toast.unknownError'));
      }
    },
  });

  return (
    <div className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="p-5 row">
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                <Image src={imageLogin} roundedCircle alt={t('headers.entrance')} />
              </Col>
              <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                <h1 className="text-center mb-4">{t('headers.entrance')}</h1>
                <Form.Group className="mb-3 form-floating" controlId="username">
                  <Form.Control
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    placeholder={t('form.yourUsername')}
                    autoComplete="username"
                    ref={inputRef}
                    isInvalid={authFailed}
                  />
                  <FormLabel>{t('form.yourUsername')}</FormLabel>
                </Form.Group>

                <Form.Group className="mb-3 form-floating" controlId="password">
                  <Form.Control
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    placeholder={t('form.password')}
                    autoComplete="password"
                    isInvalid={authFailed}
                  />
                  <FormLabel>{t('form.password')}</FormLabel>
                  <Form.Control.Feedback type="invalid" className="invalid-feedback" tooltip>{t('form.errorLogin')}</Form.Control.Feedback>
                </Form.Group>
                <Button disabled={formik.isSubmitting} type="submit" variant="outline-primary" className="w-100 mb-3">{t('buttons.entrance')}</Button>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>{t('isReg')}</span>
                {' '}
                <NavLink to={routes.pageSignUpPath()}>{t('buttons.registration')}</NavLink>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LogIn;
