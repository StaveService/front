import { gql } from "graphql-request";

export const albumsQuery = gql`
  query getAlbums($id: Int!) {
    pagination {
      totalPages
    }
    albums(id: $id) {
      id
      name
      albumLink {
        itunes
      }
    }
  }
`;
export default undefined;
