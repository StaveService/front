import { gql } from "graphql-request";

export const musicsQuery = gql`
  query getMusics($page: Int!, $q: JSON) {
    musics(page: $page, q: $q) {
      pagination {
        totalPages
      }
      data {
        id
        title
        tab
        link {
          itunes
        }
        user {
          id
          nickname
        }
        band {
          id
          name
        }
        composers {
          id
          name
        }
        lyrists {
          id
          name
        }
        albums {
          id
          title
        }
      }
    }
  }
`;
export default undefined;
