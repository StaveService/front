import { gql } from "graphql-request";

const query = gql`
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
      }
    }
  }
`;
export default query;
