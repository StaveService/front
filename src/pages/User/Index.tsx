import React, { ChangeEvent, useState } from "react";
import { useDebounce } from "use-debounce/lib";
import UsersTable from "../../components/Table/User";
import DefaultLayout from "../../layout/Default";
import usePaginate from "../../hooks/usePaginate";
import SearchTextField from "../../components/TextField/SearchTextField";
import { useUsersQuery } from "../../reactQuery/query";

const Index: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue, { isPending }] = useDebounce(inputValue, 1000);
  const [page, handlePage] = usePaginate();
  const { isLoading, data } = useUsersQuery({
    page,
    q: {
      nickname_cont: debouncedInputValue,
    },
  });
  // handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);
  return (
    <DefaultLayout>
      <SearchTextField
        onChange={handleChange}
        loading={isLoading || isPending()}
      />
      <UsersTable
        users={data?.data}
        loading={isLoading}
        page={page}
        pageCount={data?.pagination.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};

export default Index;
