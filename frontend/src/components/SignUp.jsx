import React, { useEffect, useRef, useState } from 'react';
import {
  Button, Form, Col, Card, Row, FormLabel, Image, Container,
} from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import { useAuth } from '../hooks/index.jsx';
import registrationImage from '../images/registrationImg.jpg';
import routes from '../routes.js';

const SignUp = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [regFailed, setRegFailed] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    onSubmit: async (values) => {
      setRegFailed(false);

      try {
        const { username, password } = values;
        const res = await axios.post(routes.registrationPath(), { username, password });
        auth.logIn(res.data);
        navigate(routes.pageChatPath());
      } catch (err) {
        if (err.isAxiosError && err.response.status === 409) {
          setRegFailed(true);
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
    validationSchema: yup.object().shape({
      username: yup.string()
        .min(3, t('validation.nameLengthMin'))
        .max(20, t('validation.nameLengthMax'))
        .required(t('validation.required')),
      password: yup.string()
        .min(6, t('validation.passwordLengthMin'))
        .required(t('validation.required')),
      passwordConfirmation: yup.string()
        .required(t('validation.required'))
        .oneOf(
          [yup.ref('password'), null],
          t('validation.passwordConfirmation'),
        ),
    }),
  });

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-items-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                <Image src={registrationImage} roundedCircle alt={t('headers.registration')} />
              </Col>
              <Form onSubmit={formik.handleSubmit} className="w-50">
                <h1 className="text-center mb-4">{t('headers.registration')}</h1>
                <Form.Group className="mb-3 form-floating" controlId="username">
                  <Form.Control
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    placeholder={t('form.username')}
                    autoComplete="username"
                    isInvalid={(formik.touched.username && formik.errors.username) || regFailed}
                    ref={inputRef}
                  />
                  <FormLabel>{t('form.username')}</FormLabel>
                  <Form.Control.Feedback type="invalid" className="invalid-feedback" tooltip>{formik.errors.username}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 form-floating" controlId="password">
                  <Form.Control
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    placeholder={t('form.password')}
                    autoComplete="password"
                    isInvalid={(formik.touched.password && formik.errors.password) || regFailed}
                  />
                  <FormLabel>{t('form.password')}</FormLabel>
                  <Form.Control.Feedback type="invalid" className="invalid-feedback" tooltip>{formik.errors.password}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 form-floating" controlId="passwordConfirmation">
                  <Form.Control
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.passwordConfirmation}
                    placeholder={t('form.passwordConfirmation')}
                    autoComplete="passwordConfirmation"
                    isInvalid={(formik.touched.passwordConfirmation
                               && formik.errors.passwordConfirmation) || regFailed}
                  />
                  <FormLabel>{t('form.passwordConfirmation')}</FormLabel>
                  <Form.Control.Feedback type="invalid" className="invalid-feedback" tooltip>{formik.errors.passwordConfirmation || t('exists')}</Form.Control.Feedback>
                </Form.Group>
                <Button disabled={formik.isSubmitting} type="submit" variant="outline-primary" className="w-100 mb-3">{t('buttons.register')}</Button>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>{t('isLogin')}</span>
                {' '}
                <NavLink to={routes.pageLogInPath()}>{t('buttons.entrance')}</NavLink>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
