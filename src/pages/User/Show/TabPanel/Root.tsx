import React from "react";
import MusicTable from "../../../../components/Table/Music";
import { IIndexType, IMusic } from "../../../../interfaces";

interface RootProps {
  musics: IIndexType<IMusic> | undefined;
  loading: boolean;
  page: number;
  onPage: (event: React.ChangeEvent<unknown>, value: number) => void;
}
const Post: React.FC<RootProps> = ({
  musics,
  loading,
  page,
  onPage,
}: RootProps) => {
  return (
    <MusicTable
      musics={musics?.data}
      loading={loading}
      pageCount={musics?.pagination.totalPages}
      page={page}
      onPage={onPage}
    />
  );
};
export default Post;
