import { gql } from "graphql-request";

const bandMusicsQuery = gql`
  query getBandMusics($id: Int!, $musicPage: Int!, $locale: String!) {
    band(id: $id) {
      musics(musicPage: $musicPage) {
        data {
          id
          title(locale: $locale)
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
          link {
            itunes
          }
        }
        pagination {
          totalPages
        }
      }
    }
  }
`;
export default bandMusicsQuery;
