import React, { ChangeEvent } from "react";
import {
  Control,
  DeepMap,
  FieldError,
  FieldValues,
  RegisterOptions,
  useController,
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";

export type ControlTextFieldProps = TextFieldProps & {
  name: string;
  control: Control;
  errors?: DeepMap<FieldValues, FieldError>;
  rules?: RegisterOptions;
};

const ControlTextField: React.FC<ControlTextFieldProps> = ({
  name,
  defaultValue,
  onChange,
  onKeyPress,
  // react-hook-form props
  errors,
  control,
  rules,
  ...props
}: ControlTextFieldProps) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    field: { ref, value, onChange: onChangeController },
    meta: { invalid },
  } = useController({ name, control, rules, defaultValue });
  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (onChange) onChange(e);
    onChangeController(e.target.value);
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyPress) onKeyPress(e);
  };

  return (
    <TextField
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      value={value as string}
      inputRef={ref}
      error={invalid}
      helperText={errors && <ErrorMessage errors={errors} name={name} />}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
    />
  );
};

ControlTextField.defaultProps = {
  rules: {},
};

export default ControlTextField;
