import React, { HTMLProps } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import {
  Control,
  DeepMap,
  FieldError,
  RegisterOptions,
  useController,
} from "react-hook-form";

type ControlDropzoneProps = HTMLProps<HTMLInputElement> & {
  control: Control;
  rules?: RegisterOptions;
  errors: DeepMap<Record<string, any>, FieldError>;
  onDrop: (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void;
};
const ControlDropzone: React.FC<ControlDropzoneProps> = ({
  control,
  rules,
  name = "",
  defaultValue,
  onDrop,
}: ControlDropzoneProps) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    field: { ref },
    meta: { invalid },
  } = useController({ name, control, rules, defaultValue });
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div {...getRootProps()}>
      {}
      <input
        ref={ref}
        name={name}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...getInputProps()}
      />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag n drop some files here, or click to select files</p>
      )}
    </div>
  );
};
ControlDropzone.defaultProps = {
  rules: undefined,
};
export default ControlDropzone;
