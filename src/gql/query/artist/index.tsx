import { gql } from "graphql-request";

const artistQuery = gql`
  query getArtist($id: Int!, $currentUserId: Int) {
    artist(id: $id) {
      id
      name
      link {
        id
        itunes
        twitter
        wikipedia
        spotify
      }
      bands {
        id
        name
        link {
          itunes
        }
      }
      bookmark(currentUserId: $currentUserId) {
        id
      }
      bookmarksCount
    }
  }
`;
export default artistQuery;
