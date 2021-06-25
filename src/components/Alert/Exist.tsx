import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import React from "react";
import { IAlbum, IArtist } from "../../interfaces";

interface ExistProps<T> {
  data: T[] | undefined;
  children: React.ReactChild;
}
function Exist<T extends IArtist | IAlbum>({
  data,
  children,
}: ExistProps<T>): JSX.Element {
  if (data?.length) return <></>;
  return (
    <>
      <Box my={3}>
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          Already Existed — <strong>check it out!</strong>
        </Alert>
      </Box>
      <Box mb={3}>{children}</Box>
    </>
  );
}
export default Exist;
