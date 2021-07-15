import React, { ChangeEvent, useState } from "react";
import { useDebounce } from "use-debounce/lib";
import { useQuery } from "react-query";
import ArtistsTable from "../../components/Table/Artist";
import SearchTextField from "../../components/TextField/SearchTextField";
import DefaultLayout from "../../layout/Default";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import queryKey from "../../constants/queryKey.json";
import usePaginate from "../../hooks/usePaginate";
import { getArtists } from "../../gql";

const Index: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue, { isPending }] = useDebounce(inputValue, 1000);
  const [page, handlePage] = usePaginate();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery(
    [queryKey.ARTISTS, page, debouncedInputValue],
    getArtists(page, { name_cont: debouncedInputValue }),
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
      <ArtistsTable
        artists={data?.data}
        loading={isLoading}
        page={page}
        pageCount={data?.pagination.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};

export default Index;
