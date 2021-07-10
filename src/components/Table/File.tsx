import React from "react";
import { Link as RouterLink } from "react-router-dom";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import DescriptionIcon from "@material-ui/icons/Description";
import Link from "@material-ui/core/Link";
import FolderIcon from "@material-ui/icons/Folder";
import { ITree } from "../../interfaces";

interface FilesProps {
  files: ITree[];
  blobPath: string;
  treePath: string;
}
const Files: React.FC<FilesProps> = ({
  files,
  blobPath,
  treePath,
}: FilesProps) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>files</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.oid}>
              <TableCell>
                {file.type === "blob" ? <DescriptionIcon /> : <FolderIcon />}
              </TableCell>
              <TableCell>
                {file.type === "blob" ? (
                  <Link
                    to={{
                      pathname: `${blobPath}/${file.name}`,
                      state: {
                        oid: file.oid,
                        path: file.name,
                      },
                    }}
                    component={RouterLink}
                  >
                    {file.name}
                  </Link>
                ) : (
                  <Link
                    to={{
                      pathname: `${treePath}/${file.name}`,
                      state: {
                        oid: file.oid,
                        path: file.name,
                      },
                    }}
                    component={RouterLink}
                  >
                    {file.name}
                  </Link>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default Files;
