import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Col, Card, Row, FormLabel } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import { useAuth } from '../hooks/index.jsx';

const validationRegistration = yup.object().shape({
  username: yup.string()
    .min(3, 'Must be longer than 3 characters')
    .max(20, 'Nice try, nobody has a first name that long')
    .required('Required'),
  password: yup.string()
    .min(5, 'Must be longer than 5 characters')
    .required('Required'),
  passwordConfirmation: yup.string()
    .required('Required')
    .oneOf(
      [yup.ref('password'), null],
      'Password confirmation does not match to password',
    )
});

const BuildPage = () => {
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
    validationSchema: validationRegistration,
  });

  return (
    <div className="container-fluid h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="p-5 row">
          <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
            <fieldset disabled={formik.isSubmitting}>
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
              <FormLabel htmlFor="username">Username</FormLabel>
              <Form.Control.Feedback type="invalid" className="invalid-feedback">{formik.errors.username || 'This user already exists'}</Form.Control.Feedback>
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
                <FormLabel htmlFor="password">Password</FormLabel>
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
                <FormLabel>Repeat your password</FormLabel>
                <Form.Control.Feedback type="invalid" className="invalid-feedback">{formik.errors.passwordConfirmation}</Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" variant="outline-primary" className="w-100 mb-3">Submit</Button>
            </fieldset>
          </Form>
        </Card.Body>
        <Card.Footer className="p-4">
        <div className="text-center">
        <span>Do you already logIn?</span>
        {' '}
        <NavLink to="/login">Log In</NavLink>
        </div>
        </Card.Footer>
        </Card>
        </Col>
        </Row>
        </div>
  );
};  
  export const PageRegistration = () => BuildPage();