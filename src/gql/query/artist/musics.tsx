import { gql } from "graphql-request";

const artistMusicsQuery = gql`
  query getMusics($id: Int!, $musicPage: Int!) {
    artist(id: $id) {
      musics(musicPage: $musicPage) {
        data {
          id
          title
          link {
            itunes
          }
          band {
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
