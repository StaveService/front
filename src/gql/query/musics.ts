import { gql } from "graphql-request";

const musicsQuery = gql`
  query getMusics($page: Int!, $locale: String!, $q: JSON) {
    musics(page: $page, locale: $locale, q: $q) {
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
          name(locale: $locale)
        }
        composers {
          id
          name(locale: $locale)
        }
        lyrists {
          id
          name(locale: $locale)
        }
      }
    }
  }
`;
export default musicsQuery;
