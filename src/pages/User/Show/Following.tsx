import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import DefaultLayout from "../../../layout/Default";
import UserTable from "../../../components/Table/User";
import { IUserType } from "../../../interfaces";
import queryKey from "../../../constants/queryKey.json";
import usePaginate from "../../../hooks/usePaginate";
import GraphQLClient from "../../../gql/client";
import userFollowingQuery from "../../../gql/query/user/following";

const Following: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const following = useQuery([queryKey.USER, id, queryKey.MUSICS, page], () =>
    GraphQLClient.request<IUserType>(userFollowingQuery, {
      id,
      followingPage: page,
    }).then((res) => res.user.following)
  );
  return (
    <DefaultLayout>
      <Typography variant="h5" color="initial">
        Following
      </Typography>
      <UserTable data={following.data?.data} onPage={handlePage} />
    </DefaultLayout>
  );
};
export default Following;
