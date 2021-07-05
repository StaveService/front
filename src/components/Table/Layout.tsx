import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Pagination from "@material-ui/lab/Pagination";
import React from "react";

export interface LayoutProps {
  page?: number;
  pageCount?: number;
  onPage?: (event: React.ChangeEvent<unknown>, value: number) => void;
  loading?: boolean;
  children?: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({
  page,
  pageCount,
  onPage,
  loading,
  children,
}: LayoutProps) => {
  return (
    <>
      <TableContainer component={Paper}>
        {children}
        {loading && <LinearProgress />}
      </TableContainer>
      {page && <Pagination count={pageCount} page={page} onChange={onPage} />}
    </>
  );
};
Layout.defaultProps = {
  page: undefined,
  pageCount: undefined,
  onPage: undefined,
  loading: false,
};
export default Layout;
