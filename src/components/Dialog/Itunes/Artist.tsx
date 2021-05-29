import React from "react";
import Box from "@material-ui/core/Box";
import ItunesArtistCard from "../../Card/Itunes/Artist";
import { IItunesArtist } from "../../../interfaces";
import Layout, { LayoutProps } from "./Layout";

function Artist({
  open,
  loading,
  cards,
  onClose,
  onSelect,
}: Omit<LayoutProps<IItunesArtist>, "title" | "children">): JSX.Element {
  return (
    <Layout
      title="Artist"
      open={open}
      loading={loading}
      cards={cards}
      onSelect={onSelect}
      onClose={onClose}
    >
      {(card, handleSelect) => (
        <Box key={card.artistId} mb={2} onClick={handleSelect}>
          <ItunesArtistCard artist={card} />
        </Box>
      )}
    </Layout>
  );
}

export default Artist;
