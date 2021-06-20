import { createStyles, makeStyles, SvgIcon } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import React from "react";
import { SiItunes } from "react-icons/si";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    colorPrimary: {
      color: theme.palette.itunes.main,
    },
  })
);
const Itunes: React.FC = () => {
  const classes = useStyles();
  return (
    <SvgIcon classes={{ root: classes.colorPrimary }}>
      <SiItunes />
    </SvgIcon>
  );
};
export default Itunes;
