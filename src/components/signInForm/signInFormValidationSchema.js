import * as yup from 'yup';

const signInFormValidationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export default signInFormValidationSchema;
