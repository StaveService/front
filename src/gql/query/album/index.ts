import { gql } from "graphql-request";

const albumQuery = gql`
  query getAlbum($id: Int!, $currentUserId: Int, $locale: String!) {
    album(id: $id) {
      id
      title(locale: $locale)
      localed(locale: $locale)
      link {
        id
        itunes
      }
      artists {
        id
        name(locale: $locale)
        link {
          id
          twitter
        }
      }
      bookmark(currentUserId: $currentUserId) {
        id
      }
      bookmarksCount
    }
  }
`;
export default albumQuery;
