import { gql } from "graphql-request";

export const musicsQuery = gql`
  query getMusics($page: Int) {
    musics(page: $page) {
      pagination {
        currentPage
        limitValue
        totalCount
        totalPages
      }
      musics {
        id
        title
      }
    }
  }
`;

export default undefined;
