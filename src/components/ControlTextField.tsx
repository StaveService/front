import React, { ChangeEvent, useEffect } from "react";
import {
  Control,
  DeepMap,
  FieldError,
  RegisterOptions,
  useController,
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";

export type IControlTextFieldProps = TextFieldProps & {
  control: Control;
  errors: DeepMap<Record<string, any>, FieldError>;
  rules?: RegisterOptions;
};

const ControlTextField: React.FC<IControlTextFieldProps> = ({
  name = "",
  defaultValue,
  onChange,
  onKeyPress,
  // react-hook-form props
  errors,
  control,
  rules,
  ...props
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
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      value={value as string}
      inputRef={ref}
      error={invalid}
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
