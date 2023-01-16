import React from 'react';
import { Form, Formik } from 'formik';

import styles from './signInForm.module.scss';
import CustomInput from '../../shared/customInput/CustomInput';
import signInFormInitialValues from './signInFormInitialValues';
import signInFormValidationSchema from './signInFormValidationSchema';
import { Link } from 'react-router-dom';
import { signInAuthUserWithEmailAndPassword } from '../../utils/firebase/firebase';

const SignInForm = () => {
  const onSubmit = async (values, { resetForm }) => {
    try {
      signInAuthUserWithEmailAndPassword(values.email, values.password);
      resetForm();
    } catch (error) {
      console.log('user sign in failed', error);
    }
  };

  return (
    <div className={styles.signUpForm__container}>
      <p className={styles.signUpForm__title}>Sign In</p>
      <Formik
        initialValues={signInFormInitialValues}
        validationSchema={signInFormValidationSchema}
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
            <div>
              <button type="submit">Submit</button>
            </div>
          </Form>
        )}
      </Formik>
      <Link to="/auth/signup">
        <p>Create new account.</p>
      </Link>
    </div>
  );
};

export default SignInForm;
