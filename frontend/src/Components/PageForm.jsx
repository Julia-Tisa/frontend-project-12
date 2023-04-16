import axios from 'axios';
import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/index.jsx';
import { useFormik } from 'formik';
import * as yup from 'yup';

const BuildPage = () => {
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
        .min(2, 'Must be longer than 2 characters')
        .max(20, 'Nice try, nobody has a first name that long')
        .required('Required'),
      password: yup.string()
        .min(5, 'Must be longer than 5 characters')
        .required('Required')
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
    <div className="container-fluid">
      <div className="row justify-content-center pt-5">
        <div className="col-sm-4">
          <Form onSubmit={formik.handleSubmit} className="p-3">
            <fieldset disabled={formik.isSubmitting}>
              <Form.Group>
                <Form.Label htmlFor="username">Username</Form.Label>
                <Form.Control
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  placeholder="username"
                  name="username"
                  id="username"
                  autoComplete="username"
                  isInvalid={authFailed}
                  required
                  ref={inputRef}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  placeholder="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  isInvalid={authFailed}
                  required
                />
                <Form.Control.Feedback type="invalid">the username or password is incorrect</Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" variant="outline-primary">Submit</Button>
            </fieldset>
          </Form>
        </div>
      </div>
    </div>
  );
};

export const PageForm = () => BuildPage();