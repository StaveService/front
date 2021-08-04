import { gql } from "graphql-request";

const artistsQuery = gql`
  query getArtists($page: Int!, $locale: String!, $q: JSON) {
    artists(page: $page, locale: $locale, q: $q) {
      pagination {
        totalPages
      }
      data {
        id
        name(locale: $locale)
        link {
          twitter
        }
      }
    }
  }
`;
export default artistsQuery;
