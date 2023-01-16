import * as yup from 'yup';

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

const signUpFormValidationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup
    .string()
    .min(4)
    .max(15)
    .matches(passwordRules, {
      message: 'Please create a stronger password',
    })
    .required(),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null]),
  displayName: yup.string().required(),
});

export default signUpFormValidationSchema;
