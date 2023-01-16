import React from 'react';
import { Form, Formik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';

import styles from './signUpForm.module.scss';
import CustomInput from '../../shared/customInput/CustomInput';
import signUpFormInitialValues from './signUpFormInitialValues';
import signUpFormValidationSchema from './signUpFormValidationSchema';
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from '../../utils/firebase/firebase';

const SignUpForm = () => {
  const navigate = useNavigate();

  const onSubmit = async (values, { resetForm }) => {
    const { email, password, displayName } = values;
    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );

      await createUserDocumentFromAuth(user, { displayName });
      console.log(user);
      resetForm();
      navigate('/');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Email is already in use');
      }
      console.log('user sign up failed', error);
    }
  };

  return (
    <div className={styles.signUpForm__container}>
      <p className={styles.signUpForm__title}>Sign Up</p>
      <Formik
        initialValues={signUpFormInitialValues}
        validationSchema={signUpFormValidationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <CustomInput
              label="Email"
              name="email"
              type="email"
              placeholder="Email"
            />
            <CustomInput
              label="Password"
              name="password"
              type="password"
              placeholder="password"
            />
            <CustomInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
            />
            <CustomInput
              label="Display Name"
              name="displayName"
              type="text"
              placeholder="Display Name"
            />
            <p>
              <button type="submit">Submit</button>
            </p>
          </Form>
        )}
      </Formik>
      <Link to="/auth/signin">
        <p>Log in with an existing account.</p>
      </Link>
    </div>
  );
};

export default SignUpForm;
