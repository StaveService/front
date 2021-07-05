import React from "react";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import LoadingCircularProgress from "../Loading/LoadingCircularProgress";

type SearchTextFieldProps = TextFieldProps & {
  loading: boolean;
};
const SearchTextField: React.FC<SearchTextFieldProps> = ({
  loading,
  ...props
}: SearchTextFieldProps) => {
  return (
    <TextField
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      variant="outlined"
      InputProps={{
        startAdornment: <SearchIcon />,
        endAdornment: (
          <LoadingCircularProgress
            color="inherit"
            size={20}
            loading={loading}
          />
        ),
      }}
      fullWidth
    />
  );
};
export default SearchTextField;
