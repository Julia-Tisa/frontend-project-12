import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Col, Card, Row, FormLabel, Image, Container } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import { useAuth } from '../hooks/index.jsx';
import registrationImage from '../images/registrationImg.jpg'

const BuildPage = () => {
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
        const res = await axios.post('api/v1/signup', { username, password });
        localStorage.setItem('userId', JSON.stringify({ ...res.data }));
        localStorage.setItem('name', username);
        auth.logIn({ username });
        navigate('/');
      } catch(err) {
        formik.setSubmitting(false);
        if (err.response.status === 409) {
          setRegFailed(true);
          inputRef.current.select();
          return;
        }
        throw err;
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
        )
    }),
  });

  return (
    <Container className="container-fluid h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="p-5 row">
            <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                <Image src={registrationImage} roundedCircle alt={t('headers.registration')} />
              </Col>
          <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
            <fieldset disabled={formik.isSubmitting}>
            <h1 className="text-center mb-4">{t('headers.registration')}</h1>
              <Form.Group className="mb-3 form-floating">
                <Form.Control
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  placeholder="username"
                  name="username"
                  id="username"
                  autoComplete="username"
                  isInvalid={(formik.touched.username && formik.errors.username) || regFailed}
                  required
                  ref={inputRef}
                />
              <FormLabel htmlFor="username">{t('form.username')}</FormLabel>
              <Form.Control.Feedback type="invalid" className="invalid-feedback">{formik.errors.username || t('exists')}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-4 form-floating">
                <Form.Control
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  placeholder="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  isInvalid={formik.touched.password && formik.errors.password}
                  required
                />
                <FormLabel htmlFor="password">{t('form.password')}</FormLabel>
                <Form.Control.Feedback type="invalid" className="invalid-feedback">{formik.errors.password}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-4 form-floating">
                <Form.Control
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.passwordConfirmation}
                  placeholder="passwordConfirmation"
                  name="passwordConfirmation"
                  id="passwordConfirmation"
                  autoComplete="passwordConfirmation"
                  isInvalid={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
                  required
                />
                <FormLabel>{t('form.passwordConfirmation')}</FormLabel>
                <Form.Control.Feedback type="invalid" className="invalid-feedback">{formik.errors.passwordConfirmation}</Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" variant="outline-primary" className="w-100 mb-3">{t('buttons.registration')}</Button>
            </fieldset>
          </Form>
        </Card.Body>
        <Card.Footer className="p-4">
        <div className="text-center">
        <span>{t('isLogin')}</span>
        {' '}
        <NavLink to="/login">{t('buttons.entrance')}</NavLink>
        </div>
        </Card.Footer>
        </Card>
        </Col>
        </Row>
        </Container>
  );
};  
  export const PageRegistration = () => BuildPage();