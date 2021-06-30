import React from "react";
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarIcon from "@material-ui/icons/Star";
import Typography from "@material-ui/core/Typography";

type BookmarkProps = IconButtonProps & {
  bookmarked: boolean;
  count: number | undefined;
  onCreate: () => void;
  onDestroy: () => void;
};
const Bookmark: React.FC<BookmarkProps> = ({
  count,
  bookmarked,
  onCreate,
  onDestroy,
  ...props
}: BookmarkProps) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <IconButton {...props} onClick={bookmarked ? onDestroy : onCreate}>
      {bookmarked ? (
        <>
          <Typography>{count || 0}</Typography>
          <StarIcon color="error" />
        </>
      ) : (
        <>
          <Typography>{count || 0}</Typography>
          <StarBorderIcon color="error" />
        </>
      )}
    </IconButton>
  );
};

export default Bookmark;
