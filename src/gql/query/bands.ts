import { gql } from "graphql-request";

const bandsQuery = gql`
  query getBands($page: Int!, $q: JSON) {
    bands(page: $page, q: $q) {
      pagination {
        totalPages
      }
      data {
        id
        name
      }
    }
  }
`;
export default bandsQuery;
