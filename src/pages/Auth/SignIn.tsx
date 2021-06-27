import React from "react";
import DefaultLayout from "../../layout/Default";
import SignInForm from "../../components/Form/SignIn";

const SignIn: React.FC = () => {
  return (
    <DefaultLayout>
      <SignInForm />
    </DefaultLayout>
  );
};

export default SignIn;
