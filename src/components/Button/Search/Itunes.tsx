import React from "react";
import Button, { ButtonProps } from "@material-ui/core/Button";

const Itunes: React.FC<ButtonProps> = (props: ButtonProps) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Button variant="contained" color="secondary" {...props}>
      Search by Itunes
    </Button>
  );
};
export default Itunes;
