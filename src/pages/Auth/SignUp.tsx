import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import React from "react";
import { useHistory } from "react-router-dom";
import SignUpForm from "../../components/Form/SignUp";
import DefaultLayout from "../../layout/Default";

const SignUp: React.FC = () => {
  const history = useHistory();
  const handleSuccess = () => history.push("/");
  return (
    <DefaultLayout>
      <Container maxWidth="xs">
        <Paper variant="outlined">
          <SignUpForm onSuccess={handleSuccess} />
        </Paper>
      </Container>
    </DefaultLayout>
  );
};

export default SignUp;
