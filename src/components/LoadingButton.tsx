import React from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

interface ILoadingButton {
  type?: "submit" | "button";
  loading: boolean;
  children: React.ReactNode;
  color?: "primary" | "secondary";
  fullWidth?: boolean;
  onClick?: () => void;
  onKeyDown?: (e?: React.KeyboardEvent<HTMLButtonElement>) => void;
}
const LoadingButton: React.FC<ILoadingButton> = ({
  type,
  loading,
  children,
  color,
  fullWidth,
  onClick,
  onKeyDown,
}: ILoadingButton) => (
  <Button
    type={type}
    variant="contained"
    color={color}
    startIcon={loading && <CircularProgress size={20} />}
    disabled={loading}
    disableElevation
    fullWidth={fullWidth}
    onClick={onClick}
    onKeyDown={onKeyDown}
  >
    {children}
  </Button>
);
LoadingButton.defaultProps = {
  type: "submit",
  color: "primary",
  fullWidth: true,
  onClick: undefined,
  onKeyDown: undefined,
};

export default LoadingButton;
