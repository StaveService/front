import React, { ChangeEvent, useState } from "react";
import { useQuery } from "react-query";
import { useDebounce } from "use-debounce/lib";
import MusicsTable from "../../components/Table/Music";
import DefaultLayout from "../../layout/Default";
import queryKey from "../../constants/queryKey.json";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import usePaginate from "../../hooks/usePaginate";
import { getMusics } from "../../gql";
import SearchTextField from "../../components/TextField/SearchTextField";

const Index: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue, { isPending }] = useDebounce(inputValue, 1000);
  const [page, handlePage] = usePaginate();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery(
    [queryKey.MUSICS, page, debouncedInputValue],
    getMusics(page, { title_cont: debouncedInputValue }),
    { onError }
  );
  // handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);
  return (
    <DefaultLayout>
      <SearchTextField
        onChange={handleChange}
        loading={isLoading || isPending()}
      />
      <MusicsTable
        musics={data?.data || []}
        loading={isLoading}
        page={page}
        pageCount={data?.pagination.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};
export default Index;
