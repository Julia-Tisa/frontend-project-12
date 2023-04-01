import React from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';

const BuildPage = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: yup.object().shape({
      username: yup.string()
        .min(2, "Must be longer than 2 characters")
        .max(20, "Nice try, nobody has a first name that long")
        .required("Required"),
      password: yup.string()
        .min(5, "Must be longer than 5 characters")
        .required("Required")
    }),
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="username">Username</label>
      <input
        placeholder="Julia"
        id="username"
        name="username"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.username}
      />
      {formik.touched.username && formik.errors.username ? (
        <div>{formik.errors.username}</div>
      ) : null}
  
      <label htmlFor="password">Password</label>
      <input
        placeholder="12345"
        id="password"
        name="password"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password}
      />
      {formik.touched.password && formik.errors.password ? (
        <div>{formik.errors.password}</div>
      ) : null}

      <button type="submit">Submit</button>
    </form>
  );
};

export const PageForm = () => BuildPage();

   /* <div className="container">
    <h1>Sign up</h1>
    <Formik
      initialValues={{
        username: "",
        password: ""
      }}
      validationSchema={BasicFormSchema}
      onSubmit={values => {
        alert(values);
      }}
      render={({ errors, touched }) => (
        <Form className="form-container">

          <label htmlFor="username">Username</label>
          <Field name="username" placeholder="Julia" type="text" />

          {errors.username &&
            touched.username && (
              <div className="field-error">{errors.username}</div>
            )}

          <label htmlFor="password">Password</label>
          <Field name="password" placeholder="12345" type="password" />

          {errors.password &&
            touched.password && (
              <div className="field-error">{errors.password}</div>
            )}

          <button type="submit">Submit</button>
        </Form>
      )}
    />
  </div> */