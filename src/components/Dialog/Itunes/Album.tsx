import React from "react";
import Box from "@material-ui/core/Box";
import ItunesAlbumCard from "../../Card/Itunes/Album";
import { IItunesAlbum } from "../../../interfaces";
import Layout, { LayoutProps } from "./Layout";

function Album({
  open,
  loading,
  cards,
  onClose,
  onSelect,
}: Omit<LayoutProps<IItunesAlbum>, "title" | "children">): JSX.Element {
  return (
    <Layout
      title="Album"
      open={open}
      loading={loading}
      cards={cards}
      onSelect={onSelect}
      onClose={onClose}
    >
      {(card, handleSelect) => (
        <Box key={card.collectionId} mb={2} onClick={handleSelect}>
          <ItunesAlbumCard album={card} />
        </Box>
      )}
    </Layout>
  );
}
export default Album;
