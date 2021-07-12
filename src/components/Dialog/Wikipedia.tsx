import React from "react";
import Box from "@material-ui/core/Box";
import CardSearchDialogTest, { DialogProps } from "./CardSearchDialog";
import WikipediaCard from "../Card/Wikipedia";
import { IWikipedia } from "../../interfaces";
import queryKey from "../../constants/queryKey.json";
import { searchWikipedia } from "../../axios/wikipedia";

function Wikipedia({
  defaultValue,
  open,
  showSearchBar,
  onClose,
  onSelect,
}: DialogProps<IWikipedia>): JSX.Element {
  return (
    <CardSearchDialogTest<IWikipedia>
      defaultValue={defaultValue}
      title="Wikipedia"
      open={open}
      showSearchBar={showSearchBar}
      useQueryArgs={{
        key: [queryKey.WIKIPEDIA],
        fn: ({ term, page }) =>
          searchWikipedia(term, page).then((res) => ({
            data: res.query.search,
            pageCount: Math.floor(
              res.query.searchinfo.totalhits / res.continue.sroffset
            ),
          })),
      }}
      onSelect={onSelect}
      onClose={onClose}
    >
      {(card, handleSelect) => (
        <Box key={card.pageid} mb={2} onClick={handleSelect}>
          <WikipediaCard wikipedia={card} />
        </Box>
      )}
    </CardSearchDialogTest>
  );
}

export default Wikipedia;
