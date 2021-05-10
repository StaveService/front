import { gql } from "graphql-request";

export const artistQuery = gql`
  query getArtist($id: Int!) {
    artist(id: $id) {
      id
      name
    }
  }
`;
export default undefined;
