import React, { useRef, useEffect } from "react";
import { useSelector } from 'react-redux';
import { Modal, Form, Button, FormControl } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSocket } from '../../hooks/index.jsx';
import { toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const validationChannelName = (channelsNames, t) => yup.object().shape({
  name: yup
    .string()
    .trim()
    .required(t('validation.required'))
    .min(3, t('validation.channelNameMin'))
    .max(20, t('validation.channelNameMax'))
    .notOneOf(channelsNames, t('validation.channelExists')),
});

const AddChannel = ({ onHide }) => {
  const { t } = useTranslation();
  const channels = useSelector((state) => state.channelsInfo.channels);
  const channelsName = channels.map((channel) => channel.name);
  const webSocket = useSocket();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const notifay = () => toast.success(t('toast.add'));
  const onHideHandler = () => {
    onHide();
    notifay();
  }

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (values) => {
      try {
        await webSocket.newChannel(values.name, onHideHandler);
        formik.values.name = '';
      } catch(error) {
        console.log(error.message);
      }
    },
    validationSchema: validationChannelName(channelsName, t),
  });

    return (
        <Modal show centered onHide={onHide}>
          <Modal.Header closeButton>
            <Modal.Title>{t('channels.add')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group>
                <Form.Control
                  className="mb-2"
                  ref={inputRef}
                  id="name"
                  name="name"
                  required
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  isInvalid={!!formik.errors.name}
                />
                <Form.Label htmlFor="name" visuallyHidden>{t('channels.name')}</Form.Label>
                <FormControl.Feedback type="invalid">
                  {formik.errors.name}
                </FormControl.Feedback>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={onHide}
                  >
                    {t('channels.cancel')}
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={formik.handleSubmit}
                    disabled={formik.errors.name}
                  >
                    {t('channels.submit')}
                  </Button>
                </Modal.Footer>
              </Form.Group>
            </Form>
          </Modal.Body>
        </Modal>
      );
};

export default AddChannel;
