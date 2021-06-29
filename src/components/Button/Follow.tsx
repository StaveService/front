import Button from "@material-ui/core/Button";
import React from "react";

interface FollowProps {
  followed: boolean | undefined;
  onFollow: () => void;
  onUnfollow: () => void;
}
const Follow: React.FC<FollowProps> = ({
  followed,
  onFollow,
  onUnfollow,
}: FollowProps) => {
  if (followed) return <Button onClick={onUnfollow}>UnFollow</Button>;
  return <Button onClick={onFollow}>Follow</Button>;
};
export default Follow;
