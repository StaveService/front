import React from "react";
import Button, { ButtonProps } from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

type ILoadingButton = ButtonProps & { loading: boolean };
const LoadingButton: React.FC<ILoadingButton> = ({
  disabled,
  loading,
  children,
  ...props
}: ILoadingButton) => (
  <Button
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    variant="contained"
    startIcon={loading && <CircularProgress size={20} />}
    disabled={loading || disabled}
    disableElevation
  >
    {children}
  </Button>
);
export default LoadingButton;
