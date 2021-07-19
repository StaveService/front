import React from "react";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import { useHistory } from "react-router-dom";
import DefaultLayout from "../../layout/Default";
import SignInForm from "../../ui/Form/SignIn";

const SignIn: React.FC = () => {
  const history = useHistory();
  const handleSuccess = () => history.push("/");
  return (
    <DefaultLayout>
      <Container maxWidth="xs">
        <Paper variant="outlined">
          <SignInForm onSuccess={handleSuccess} />
        </Paper>
      </Container>
    </DefaultLayout>
  );
};

export default SignIn;
