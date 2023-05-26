import React, { useRef, useEffect } from 'react';
import {
  Form, Button, InputGroup, Container,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { BsArrowRightSquare } from 'react-icons/bs';
import leoProfanity from 'leo-profanity';
import * as yup from 'yup';
import { useAuth, useApi } from '../../hooks/index.jsx';

const SendingWindow = ({ currentChannel }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const api = useApi();
  const messageRef = useRef(null);

  useEffect(() => {
    messageRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: async (values) => {
      const text = leoProfanity.clean(values.body);
      const message = {
        text,
        channelId: currentChannel.id,
        username: user.username,
      };

      try {
        await api.sendMessage(message);
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
    <Container className="mt-auto px-5 py-3">
      <Form
        noValidate
        className="py-1 border rounded-2"
        onSubmit={formik.handleSubmit}
      >
        <InputGroup>
          <Form.Control
            name="body"
            ref={messageRef}
            aria-label="Новое сообщение"
            placeholder={t('messages.enter')}
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
            disabled={formik.isSubmitting}
          >
            <BsArrowRightSquare size={20} />
          </Button>
        </InputGroup>
      </Form>
    </Container>
  );
};

export default SendingWindow;
