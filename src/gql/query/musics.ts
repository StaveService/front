import { gql } from "graphql-request";

export const musicsQuery = gql`
  query getMusics($page: Int) {
    musics(page: $page) {
      pagination {
        totalPages
      }
      data {
        id
        title
        musicLink {
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
      }
    }
  }
`;
export default undefined;
