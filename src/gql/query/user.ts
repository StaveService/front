import { gql } from "graphql-request";

export const userQuery = gql`
  query getUser($id: Int!, $musicPage: Int!) {
    user(id: $id) {
      nickname
      musics(musicPage: $musicPage) {
        data {
          id
          title
          band {
            name
          }
          composers {
            name
          }
          lyrists {
            name
          }
          musicLink {
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

export default undefined;
