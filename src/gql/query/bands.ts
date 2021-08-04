import { gql } from "graphql-request";

const bandsQuery = gql`
  query getBands($page: Int!, $locale: String!, $q: JSON) {
    bands(page: $page, locale: $locale, q: $q) {
      pagination {
        totalPages
      }
      data {
        id
        name(locale: $locale)
      }
    }
  }
`;
export default bandsQuery;
