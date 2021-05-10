import { gql } from "graphql-request";

export const bandsQuery = gql`
  query getBands($page: Int) {
    bands(page: $page) {
      pagination {
        currentPage
        totalPages
      }
      data {
        id
        name
      }
    }
  }
`;
export default undefined;
