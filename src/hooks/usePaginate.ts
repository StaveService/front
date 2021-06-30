import React, { useCallback, useState } from "react";

const usePagenate = (): [
  number,
  (_event: React.ChangeEvent<unknown>, value: number) => void
] => {
  const [page, setPage] = useState(1);
  const onPage = useCallback(
    (_event: React.ChangeEvent<unknown>, value: number) => setPage(value),
    []
  );
  return [page, onPage];
};

export default usePagenate;
