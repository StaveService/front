import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { FormattedMessage } from "react-intl";
import DefaultLayout from "../../../layout/Default";
import UserTable from "../../../components/Table/User";
import queryKey from "../../../constants/queryKey.json";
import usePaginate from "../../../hooks/usePaginate";
import { getUserFollower } from "../../../gql";

const Follower: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const followers = useQuery(
    [queryKey.USER, id, queryKey.MUSICS, page],
    getUserFollower(id, page)
  );
  return (
    <DefaultLayout>
      <Typography variant="h5" color="initial">
        <FormattedMessage id="follower" />
      </Typography>
      <UserTable
        users={followers.data?.data}
        loading={followers.isLoading}
        page={page}
        pageCount={followers.data?.pagination.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};
export default Follower;
