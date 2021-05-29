import React from "react";
import Box from "@material-ui/core/Box";
import ItunesMusicCard from "../../Card/Itunes/Music";
import { IItunesMusic } from "../../../interfaces";
import Layout, { LayoutProps } from "./Layout";

function Music({
  open,
  loading,
  cards,
  onClose,
  onSelect,
}: Omit<LayoutProps<IItunesMusic>, "title" | "children">): JSX.Element {
  return (
    <Layout
      title="Music"
      open={open}
      loading={loading}
      cards={cards}
      onSelect={onSelect}
      onClose={onClose}
    >
      {(card, handleSelect) => (
        <Box key={card.trackId} mb={2} onClick={handleSelect}>
          <ItunesMusicCard music={card} />
        </Box>
      )}
    </Layout>
  );
}

export default Music;
