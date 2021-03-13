import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

interface ILoadingButton {
  loading: boolean;
  children: React.ReactNode;
  color?: 'primary' | 'secondary';
  fullWidth?: boolean;
  onClick?: () => void;
}
const LoadingButton: React.FC<ILoadingButton> = ({
  loading,
  children,
  color,
  fullWidth,
  onClick,
}: ILoadingButton) => (
  <Button
    type="submit"
    variant="contained"
    color={color}
    startIcon={
        loading && <CircularProgress size={20} />
    }
    disabled={loading}
    disableElevation
    fullWidth={fullWidth}
    onClick={onClick}
  >
    {children}
  </Button>
);
LoadingButton.defaultProps = {
  color: 'primary',
  fullWidth: true,
  onClick: undefined,
};

export default LoadingButton;
