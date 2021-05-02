import React from "react";
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarIcon from "@material-ui/icons/Star";

type BookmarkProps = IconButtonProps & {
  bookmarked: boolean;
  onCreate: () => void;
  onDestroy: () => void;
};

const Bookmark: React.FC<BookmarkProps> = ({
  bookmarked,
  onCreate,
  onDestroy,
  ...props
}: BookmarkProps) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <IconButton {...props} onClick={bookmarked ? onDestroy : onCreate}>
      {bookmarked ? <StarIcon /> : <StarBorderIcon />}
    </IconButton>
  );
};
export default Bookmark;
