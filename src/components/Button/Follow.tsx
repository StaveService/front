import React from "react";
import Button, { ButtonProps } from "@material-ui/core/Button";

interface FollowProps extends ButtonProps {
  followed: boolean | undefined;
  onFollow: () => void;
  onUnfollow: () => void;
}
const Follow: React.FC<FollowProps> = ({
  followed,
  onFollow,
  onUnfollow,
  ...props
}: FollowProps) => {
  if (followed)
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Button onClick={onUnfollow} {...props}>
        UnFollow
      </Button>
    );
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Button onClick={onFollow} {...props}>
      Follow
    </Button>
  );
};
export default Follow;
