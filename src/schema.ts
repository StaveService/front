import * as yup from "yup";

const email = yup.string().email().required();
const required = yup.string().required();
const password = required;
const signInSchema = yup.object().shape({
  email,
  password,
});
const signUpSchema = yup.object().shape({
  email,
  nickname: required,
  familyname: required,
  givenname: required,
  password,
  passwordConfirmation: yup.string().oneOf([yup.ref("password"), null]),
});

export { signInSchema, signUpSchema };
