import React, { ChangeEvent } from "react";
import { Control, DeepMap, FieldError, useController } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import TextField from "@material-ui/core/TextField";

interface IControlTextFieldProps {
  // html5 props
  name: string;
  defaultValue: string;
  type?: "text" | "email" | "password" | "date" | "hidden" | "datetime-local";
  autoComplete?:
    | "off"
    | "on"
    | "given-name"
    | "family-name"
    | "nickname"
    | "new-password";
  onChange?: (value: string) => void;
  onKeyPress?: (value: React.KeyboardEvent<HTMLInputElement>) => void;

  // material-ui props
  label: string;
  fullWidth?: boolean;
  disabled?: boolean;
  variant?: "filled" | "outlined" | "standard";
  InputLabelProps?: {
    shrink: boolean | undefined;
  };

  // react-hook-form props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<Record<string, any>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: DeepMap<Record<string, any>, FieldError>;
}

const ControlTextField: React.FC<IControlTextFieldProps> = ({
  // html5 props
  type,
  name,
  defaultValue,
  autoComplete,
  onChange,
  onKeyPress,
  // material-ui props
  label,
  fullWidth,
  disabled,
  variant,
  InputLabelProps,
  // react-hook-form props
  errors,
  control,
}: IControlTextFieldProps) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    field: { ref, value, onChange: onChangeController },
    meta: { invalid },
  } = useController({ name, control, defaultValue });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value);
    onChangeController(e.target.value);
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyPress) onKeyPress(e);
  };

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
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      InputLabelProps={InputLabelProps}
    />
  );
};

ControlTextField.defaultProps = {
  type: "text",
  autoComplete: "off",

  variant: "standard",
  disabled: false,
  fullWidth: false,
  InputLabelProps: { shrink: undefined },

  onChange: undefined,
  onKeyPress: undefined,
};

export default ControlTextField;
