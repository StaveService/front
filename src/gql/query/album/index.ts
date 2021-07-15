import { gql } from "graphql-request";

const albumQuery = gql`
  query getAlbum($id: Int!, $currentUserId: Int) {
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
      bookmark(currentUserId: $currentUserId) {
        id
      }
      bookmarksCount
    }
  }
`;
export default albumQuery;
