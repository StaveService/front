import { gql } from "graphql-request";

const musicsQuery = gql`
  query getMusics($page: Int!, $locale: String!, $q: JSON) {
    musics(page: $page, q: $q) {
      pagination {
        totalPages
      }
      data {
        id
        title(locale: $locale)
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
export default musicsQuery;
