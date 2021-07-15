import React from "react";
import { IWikipedia } from "../../interfaces";

interface WikipediaProps {
  wikipedia: IWikipedia;
}
const Wikipedia: React.FC<WikipediaProps> = ({
  wikipedia: { title },
}: WikipediaProps) => {
  return (
    <div>
      <p>{title}</p>
    </div>
  );
};
export default Wikipedia;
