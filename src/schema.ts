import * as yup from "yup";

const addRoleSchema = yup.object().shape({
  artist_id: yup.number().required(),
  role: yup.number().required(),
});
const userSchema = yup.object().shape({
  email: yup.string().email().required(),
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
  description: yup.string().required(),
});

export { issueSchema, addRoleSchema, userSchema, contactSchema };
