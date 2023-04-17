import React, { useRef, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Modal, Form, Button, FormControl } from 'react-bootstrap';
import * as yup from 'yup';
import { useSocket } from '../../hooks/index.jsx';

const validationChannelName = (channelsNames) => yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('Required')
    .min(1, 'Too short for channel name')
    .max(20, 'Nice try, but why')
    .notOneOf(channelsNames, 'This channel name already exists'),
});

const RenameChannel = ({ modalInfo, onHide }) => {
  const channels = useSelector((state) => state.channelsInfo.channels);
  const channelsName = channels.map((channel) => channel.name);
  const webSocket = useSocket();
  const inputRef = useRef(null);

  const currentChannel = modalInfo.channel;

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: currentChannel.name,
    },
    onSubmit: async (values) => {
      try {
        webSocket.renamingChannel({ name: values.name, id: currentChannel.id }, onHide);
        formik.values.name = '';
      } catch(error) {
        console.log(error.message);
      }
    },
    validationSchema: validationChannelName(channelsName),
  });

  return (
    <Modal show centered onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Rename channel</Modal.Title>
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
            <Form.Label htmlFor="name" visuallyHidden>Channel name</Form.Label>
            <FormControl.Feedback type="invalid">
              {formik.errors.name}
            </FormControl.Feedback>
            <Modal.Footer>
              <Button
                variant="secondary"
                type="button"
                onClick={onHide}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                onClick={formik.handleSubmit}
                disabled={formik.errors.name}
              >
                Rename
              </Button>
            </Modal.Footer>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannel;
