import { gql } from "graphql-request";

const userMusicsQuery = gql`
  query getUserMusics($id: Int!, $musicPage: Int!, $locale: String!) {
    user(id: $id) {
      musics(musicPage: $musicPage) {
        data {
          id
          title(locale: $locale)
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
          link {
            itunes
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

export default userMusicsQuery;
