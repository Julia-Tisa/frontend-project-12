import React, { useRef, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { BsArrowRightSquare } from 'react-icons/bs';
import * as yup from 'yup';
import { useAuth, useSocket } from '../../hooks/index.jsx';

const SendingWindow = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const messageRef = useRef(null);

  useEffect(() => {
    messageRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: async (values) => {
      const message = {
        text: values.body,
        username: user.username,
      };

      try {
        await socket.sendMessage(message);
        formik.values.body = '';
      } catch (error) {
        console.error(error.message);
      }
    },
    validateOnChange: yup.object({
      body: yup.string().trim().required(),
    }),
  });
  return (
    <div className="mt-auto px-5 py-3">
      <Form
        noValidate
        className="py-1 border rounded-2"
        onSubmit={formik.handleSubmit}
      >
        <Form.Group className="input-group">
        <Form.Label visuallyHidden htmlFor="body">Enter your message here...</Form.Label>
          <Form.Control
            name="body"
            ref={messageRef}
            aria-label="New message"
            placeholder="Enter your message here..."
            className="border-0 p-0 ps-2"
            value={formik.values.body}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            id="body"
            required
          />
          <Button
            type="submit"
            style={{ border: 'none' }}
            variant="group-vertical"
            disabled={formik.errors.body}
            onClick={formik.handleSubmit}
          >
            <BsArrowRightSquare size={20} />
            <span className="visually-hidden">Send</span>
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default SendingWindow;