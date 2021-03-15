import * as yup from 'yup';

const signInSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});
const signUpSchema = yup.object().shape({
  email: yup.string().email().required(),
  name: yup.string().required(),
  password: yup.string().required(),
  passwordConfirmation: yup.string().oneOf([yup.ref('password'), null]),
});
const profileSchema = yup.object().shape({
  name: yup.string().required(),
  introduction: yup.string().required(),
  gender: yup.number(),
  birthday: yup.date(),
});
const emailSchema = yup.object().shape({
  email: yup.string().email().required(),
});
const passwordSchema = yup.object().shape({
  password: yup.string().required(),
  passwordConfirmation: yup.string().oneOf([yup.ref('password'), null]),
});

export {
  signInSchema,
  signUpSchema,
  profileSchema,
  emailSchema,
  passwordSchema,
};
