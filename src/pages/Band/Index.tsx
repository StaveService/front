import React, { ChangeEvent, useState } from "react";
import { useDebounce } from "use-debounce/lib";
import { useSelector } from "react-redux";
import BandsTable from "../../components/Table/Band";
import DefaultLayout from "../../layout/Default";
import usePaginate from "../../hooks/usePaginate";
import SearchTextField from "../../components/TextField/SearchTextField";
import { selectLocale } from "../../slices/language";
import { useBandsQuery } from "../../reactQuery/query";

const Index: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [page, handlePage] = usePaginate();
  const [debouncedInputValue, { isPending }] = useDebounce(inputValue, 1000);
  const locale = useSelector(selectLocale);
  const { isLoading, data } = useBandsQuery({
    page,
    locale,
    q: {
      name_cont: debouncedInputValue,
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
      <BandsTable
        bands={data?.data || []}
        loading={isLoading}
        page={page}
        pageCount={data?.pagination.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};
export default Index;
