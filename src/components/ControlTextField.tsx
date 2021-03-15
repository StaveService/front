import React from 'react';
import {
  Control, DeepMap, FieldError, useController,
} from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import TextField from '@material-ui/core/TextField';

interface IControlTextFieldProps {
  type: string
  name: string
  label: string
  defaultValue: string
  fullWidth?: boolean
  disabled?: boolean
  variant?: 'filled' | 'outlined' | 'standard'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<Record<string, any>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: DeepMap<Record<string, any>, FieldError>
}

const ControlTextField:React.FC<IControlTextFieldProps> = ({
  type,
  name,
  label,
  control,
  defaultValue,
  fullWidth,
  disabled,
  variant,
  errors,
}: IControlTextFieldProps) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    field: { ref, value, onChange },
    meta: { invalid },
  } = useController({ name, control, defaultValue });
  return (
    <TextField
      type={type}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      value={value}
      inputRef={ref}
      error={invalid}
      label={label}
      disabled={disabled}
      fullWidth={fullWidth}
      margin="normal"
      variant={variant}
      helperText={<ErrorMessage errors={errors} name={name} />}
      onChange={onChange}
    />
  );
};

ControlTextField.defaultProps = {
  variant: 'standard',
  disabled: false,
  fullWidth: false,
};

export default ControlTextField;
