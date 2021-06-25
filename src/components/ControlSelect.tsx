import React, { ChangeEvent } from "react";
import { Control, RegisterOptions, useController } from "react-hook-form";
import Select, { SelectProps } from "@material-ui/core/Select";

type ControlSelectProps = SelectProps & {
  name: string;
  control: Control;
  rules?: RegisterOptions;
};

const ControlSelect: React.FC<ControlSelectProps> = ({
  name,
  defaultValue,
  onChange,
  onKeyPress,
  // react-hook-form props
  control,
  rules,
  children,
  ...props
}: ControlSelectProps) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    field: { ref, value, onChange: onChangeController },
    meta: { invalid },
  } = useController({ name, control, rules, defaultValue });
  const handleChange = (
    e: ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
    child: React.ReactNode
  ) => {
    if (onChange) onChange(e, child);
    onChangeController(e.target.value);
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyPress) onKeyPress(e);
  };

  return (
    <Select
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      value={value as string}
      inputRef={ref}
      error={invalid}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
    >
      {children}
    </Select>
  );
};

ControlSelect.defaultProps = {
  rules: {},
};

export default ControlSelect;
