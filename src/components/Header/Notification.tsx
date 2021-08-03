import React from "react";
import { formatDistanceToNow } from "date-fns";
import { AxiosResponse } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "react-query";
import { Link as RouterLink } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import StarIcon from "@material-ui/icons/Star";
import { patchUserNotification } from "../../axios/axios";
import {
  selectCurrentUser,
  setHeaders,
} from "../../slices/currentUser/currentUser";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import { IIndexType, INotification } from "../../interfaces";
import routes from "../../constants/routes.json";
import queryKey from "../../constants/queryKey.json";

interface NotificationProps {
  notifications: INotification[] | undefined;
  loading: boolean;
}
const Notification: React.FC<NotificationProps> = ({
  notifications,
  loading,
}: NotificationProps) => {
  const { onError } = useQuerySnackbar();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const queryClient = useQueryClient();
  const onSuccess = (res: AxiosResponse<INotification>, id: number) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<
      (IIndexType<INotification> & { notificationExist: boolean }) | undefined
    >([queryKey.NOTIFICATIONS, 1], (prev) => {
      if (!prev) return prev;
      prev.data[
        prev.data.findIndex((prevNotification) => prevNotification.id === id)
      ].readAt = new Date().toLocaleDateString();
      prev.notificationExist = prev.data.some(
        (prevNotification) => !prevNotification.readAt
      );
      return prev;
    });
  };
  const { mutate } = useMutation(
    (id: number) => patchUserNotification(id, currentUser?.id),
    { onError, onSuccess }
  );
  return (
    <Box p={1}>
      {loading && <LinearProgress />}
      {!notifications?.length && <Typography variant="h6">Nothing</Typography>}
      {notifications?.map((notification) => {
        const handleClick = () => mutate(notification.id);
        if (notification.type === "UserRelationshipNotification")
          return (
            <ListItem
              key={notification.id}
              component={RouterLink}
              to={`${routes.USERS}/${notification.params.userRelationship.follower.id}`}
              selected={!!notification.readAt}
              onClick={handleClick}
              button
            >
              <ListItemAvatar>
                <Avatar>
                  <PersonAddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`followed by ${notification.params.userRelationship.follower.nickname}`}
                secondary={formatDistanceToNow(
                  new Date(notification.createdAt)
                )}
              />
            </ListItem>
          );
        if (notification.type === "MusicBookmarkNotification")
          return (
            <ListItem
              key={notification.id}
              component={RouterLink}
              to={`${routes.USERS}/${notification.params.musicBookmark.user.id}`}
              selected={!!notification.readAt}
              onClick={handleClick}
              button
            >
              <ListItemAvatar>
                <Avatar>
                  <StarIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${notification.params.musicBookmark.user.nickname} bookmarked ${notification.params.musicBookmark.music.title}`}
                secondary={formatDistanceToNow(
                  new Date(notification.createdAt)
                )}
              />
            </ListItem>
          );
        return <></>;
      })}
    </Box>
  );
};

export default Notification;