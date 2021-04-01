import React, { ChangeEvent } from "react";
import {
  Control,
  DeepMap,
  FieldError,
  RegisterOptions,
  useController,
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";

type IControlTextFieldProps = TextFieldProps & {
  control: Control;
  errors: DeepMap<Record<string, any>, FieldError>;
  rules?: RegisterOptions;
};

const ControlTextField: React.FC<IControlTextFieldProps> = ({
  // html5 props
  type,
  name = "",
  defaultValue,
  autoComplete,
  onChange,
  onKeyPress,
  // material-ui props
  label,
  fullWidth,
  disabled,
  variant,
  InputProps,
  InputLabelProps,
  // react-hook-form props
  errors,
  control,
  rules,
}: IControlTextFieldProps) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    field: { ref, value, onChange: onChangeController },
    meta: { invalid },
  } = useController({ name, control, rules, defaultValue });
  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (onChange) onChange(e.target.value);
    onChangeController(e.target.value);
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyPress) onKeyPress(e);
  };

  return (
    <TextField
      type={type}
      value={value as string}
      autoComplete={autoComplete}
      inputRef={ref}
      label={label}
      error={invalid}
      disabled={disabled}
      fullWidth={fullWidth}
      margin="normal"
      variant={variant}
      InputProps={InputProps}
      InputLabelProps={InputLabelProps}
      helperText={<ErrorMessage errors={errors} name={name} />}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
    />
  );
};

ControlTextField.defaultProps = {
  rules: {},
};

export default ControlTextField;
