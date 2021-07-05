import React, { ChangeEvent, useState } from "react";
import { useQuery } from "react-query";
import { useDebounce } from "use-debounce/lib";
import AlbumTable from "../../components/Table/Album";
import SearchTextField from "../../components/TextField/SearchTextField";
import DefaultLayout from "../../layout/Default";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import usePaginate from "../../hooks/usePaginate";
import queryKey from "../../constants/queryKey.json";
import { getAlbums } from "../../gql";

const Index: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue] = useDebounce(inputValue, 1000);
  const [page, handlePage] = usePaginate();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery(
    [queryKey.ALBUMS, page, debouncedInputValue],
    getAlbums(page, { title_cont: debouncedInputValue }),
    { onError }
  );
  // handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);
  return (
    <DefaultLayout>
      <SearchTextField onChange={handleChange} loading={isLoading} />
      <AlbumTable
        albums={data?.data || []}
        loading={isLoading}
        page={page}
        pageCount={data?.pagination.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};

export default Index;
