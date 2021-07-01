import { gql } from "graphql-request";

const albumQuery = gql`
  query getAlbum($id: Int!) {
    album(id: $id) {
      id
      title
      link {
        id
        itunes
      }
      artists {
        id
        name
      }
    }
  }
`;
export default albumQuery;
