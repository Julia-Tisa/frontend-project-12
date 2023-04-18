import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Col, Card, Row, FormLabel } from 'react-bootstrap';
import { useNavigate, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../hooks/index.jsx';

const BuildPage = () => {
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
        .min(3, t('validation.nameLengthMin'))
        .max(20, t('validation.nameLengthMax'))
        .required(t('validation.required')),
      password: yup.string()
        .min(5, t('validation.passwordLengthMin'))
        .required(t('validation.required'))
    }),
    onSubmit: async (values) => {
      setAuthFailed(false);

      try {
        const res = await axios.post('api/v1/login', values);
        localStorage.setItem('userId', JSON.stringify({ ...res.data }));
        localStorage.setItem('name', values.username);
        auth.logIn({ username: values.username });
        navigate('/');
      } catch (err) {
        formik.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
          return;
        }
        throw err;
      }
    },
  });

  return (
    <div className="container-fluid h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="p-5 row">
          <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
            <fieldset disabled={formik.isSubmitting}>
              <h1 className="text-center mb-4">{t('headers.entrance')}</h1>
              <Form.Group className="mb-3 form-floating">
                <Form.Control
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  placeholder="username"
                  name="username"
                  id="username"
                  autoComplete="username"
                  isInvalid={authFailed}
                  required
                  ref={inputRef}
                />
                <FormLabel>{t('form.username')}</FormLabel>
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
                  isInvalid={authFailed}
                  required
                />
                <FormLabel>{t('form.password')}</FormLabel>
                <Form.Control.Feedback type="invalid" className="invalid-feedback">{t('form.errorLogin')}</Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" variant="outline-primary" className="w-100 mb-3">{t('buttons.entrance')}</Button>
            </fieldset>
          </Form>
        </Card.Body>
        <Card.Footer className="p-4">
        <div className="text-center">
        <span>{t('isReg')}</span>
        {' '}
        <NavLink to="/signup">{t('buttons.record')}</NavLink>
        </div>
        </Card.Footer>
        </Card>
        </Col>
        </Row>
        </div>
  );
};

export const PageForm = () => BuildPage();