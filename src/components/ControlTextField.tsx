import React from 'react';
import {
  Control, DeepMap, FieldError, useController,
} from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import TextField from '@material-ui/core/TextField';

interface IControlTextFieldProps {
  // html5 props
  name: string
  defaultValue: string
  type?: 'text' | 'email' | 'password'
  autoComplete?: 'off' | 'on' | 'given-name' | 'family-name' | 'nickname' | 'new-password'

  // material-ui props
  label: string
  fullWidth?: boolean
  disabled?: boolean
  variant?: 'filled' | 'outlined' | 'standard'

  // react-hook-form props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<Record<string, any>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: DeepMap<Record<string, any>, FieldError>
}

const ControlTextField:React.FC<IControlTextFieldProps> = ({
  // html5 props
  type,
  name,
  defaultValue,
  autoComplete,
  // material-ui props
  label,
  fullWidth,
  disabled,
  variant,
  // react-hook-form props
  errors,
  control,
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
      autoComplete={autoComplete}
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
  type: 'text',
  variant: 'standard',
  disabled: false,
  fullWidth: false,
  autoComplete: 'off',
};

export default ControlTextField;
