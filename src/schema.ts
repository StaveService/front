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
  nickname: yup.string().required().min(4).max(30),
  familyname: yup.string().required().max(35),
  givenname: yup.string().required().max(35),
  password,
  passwordConfirmation: yup.string().oneOf([yup.ref("password"), null]),
});
const addRoleSchema = yup.object().shape({
  artist_id: yup.number().required(),
  role: yup.number().required(),
});
const userSchema = yup.object().shape({
  email,
  nickname: yup.string().required().min(4).max(30),
  familyname: yup.string().required().max(35),
  givenname: yup.string().required().max(35),
  introduction: yup.string(),
});
const issueSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
});
const contactSchema = yup.object().shape({
  email: yup.string().email().required(),
  description: required,
});

export {
  issueSchema,
  addRoleSchema,
  signInSchema,
  signUpSchema,
  userSchema,
  contactSchema,
};
