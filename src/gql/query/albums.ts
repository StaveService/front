import { gql } from "graphql-request";

const albumsQuery = gql`
  query getAlbums($page: Int!, $locale: String!, $q: JSON) {
    albums(page: $page, locale: $locale, q: $q) {
      pagination {
        totalPages
      }
      data {
        id
        title(locale: $locale)
        link {
          itunes
        }
      }
    }
  }
`;
export default albumsQuery;
