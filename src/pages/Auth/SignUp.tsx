import React from "react";
import SignUpForm from "../../components/Form/SignUp";
import DefaultLayout from "../../layout/Default";

const SignUp: React.FC = () => {
  return (
    <DefaultLayout>
      <SignUpForm />
    </DefaultLayout>
  );
};

export default SignUp;
