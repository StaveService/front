import React from "react";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { FormattedMessage } from "react-intl";
import DefaultLayout from "../../../layout/Default";
import UserTable from "../../../components/Table/User";
import usePaginate from "../../../hooks/usePaginate";
import { useUserFollowerQuery } from "../../../reactQuery/query";

const Follower: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const followers = useUserFollowerQuery({ id, page });
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
