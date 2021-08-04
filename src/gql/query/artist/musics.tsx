import { gql } from "graphql-request";

const artistMusicsQuery = gql`
  query getMusics($id: Int!, $musicPage: Int!, $locale: String!) {
    artist(id: $id) {
      musics(musicPage: $musicPage) {
        data {
          id
          title(locale: $locale)
          link {
            itunes
          }
          band {
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
          user {
            id
            nickname
          }
        }
        pagination {
          totalPages
        }
      }
    }
  }
`;
export default artistMusicsQuery;
