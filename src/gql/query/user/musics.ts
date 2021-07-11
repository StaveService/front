import { gql } from "graphql-request";

const userMusicsQuery = gql`
  query getUserMusics($id: Int!, $musicPage: Int!) {
    user(id: $id) {
      musics(musicPage: $musicPage) {
        data {
          id
          title
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
