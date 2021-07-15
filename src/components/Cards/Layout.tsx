import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Box from "@material-ui/core/Box";
import { IMusic } from "../../interfaces";

interface CardsProps<T> {
  cards: T[] | undefined;
  children: (card1: T, card2: T) => React.ReactNode;
}
function Cards<T extends IMusic>({
  cards,
  children,
}: CardsProps<T>): JSX.Element {
  function eachSplice(arr: T[], size: number) {
    return arr.reduce(
      (newarr, _, i) =>
        i % size ? newarr : [...newarr, arr.slice(i, i + size)],
      [] as T[][]
    );
  }
  return (
    <Box mb={3}>
      <Slider speed={500}>
        {eachSplice(cards || [], 2).map(([card1, card2]) => (
          <Box py={3} key={card1.id}>
            {children(card1, card2)}
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
export default Cards;
