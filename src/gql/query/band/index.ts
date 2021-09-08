import { gql } from "graphql-request";

const bandQuery = gql`
  query getBand($id: Int!, $currentUserId: Int, $locale: String!) {
    band(id: $id) {
      id
      name(locale: $locale)
      localed(locale: $locale)
      link {
        id
        itunes
        twitter
        spotify
        wikipedia(locale: $locale)
        youtube
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
export default bandQuery;
