import { gql } from "graphql-request";

const artistQuery = gql`
  query getArtist($id: Int!, $currentUserId: Int, $locale: String!) {
    artist(id: $id) {
      id
      name(locale: $locale)
      link {
        id
        itunes
        twitter
        wikipedia
        spotify
      }
      bands {
        id
        name(locale: $locale)
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
