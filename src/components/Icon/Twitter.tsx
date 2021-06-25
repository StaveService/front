import SvgIcon from "@material-ui/core/SvgIcon";
// import { Theme } from "@material-ui/core/styles/createMuiTheme";
// import createStyles from "@material-ui/core/styles/createStyles";
// import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { FaTwitter } from "react-icons/fa";

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     colorPrimary: {
//       color: theme.palette.twitter.main,
//     },
//   })
// );
const Twitter: React.FC = () => {
  // const classes = useStyles();
  return (
    <SvgIcon
    // classes={{ root: classes.colorPrimary }}
    >
      <FaTwitter />
    </SvgIcon>
  );
};
export default Twitter;
