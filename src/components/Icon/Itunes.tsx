import SvgIcon from "@material-ui/core/SvgIcon";
// import { Theme } from "@material-ui/core/styles";
// import createStyles from "@material-ui/core/styles/createStyles";
// import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { SiItunes } from "react-icons/si";

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     colorPrimary: {
//       color: theme.palette.itunes.main,
//     },
//   })
// );
const Itunes: React.FC = () => {
  // const classes = useStyles();
  return (
    <SvgIcon
    // classes={{ root: classes.colorPrimary }}
    >
      <SiItunes size={23} />
    </SvgIcon>
  );
};
export default Itunes;
