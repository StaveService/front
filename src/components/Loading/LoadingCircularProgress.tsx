import React from "react";
import CircularProgress, {
  CircularProgressProps,
} from "@material-ui/core/CircularProgress";

interface ILoadingCircularProgress extends CircularProgressProps {
  loading: boolean;
}
const LoadingCircularProgress: React.FC<ILoadingCircularProgress> = ({
  loading,
  ...props
}: ILoadingCircularProgress) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <>{loading ? <CircularProgress {...props} /> : null}</>
);

export default LoadingCircularProgress;
