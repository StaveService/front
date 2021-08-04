import { gql } from "graphql-request";

const bandMusicsQuery = gql`
  query getBandMusics($id: Int!, $musicPage: Int!) {
    band(id: $id) {
      musics(musicPage: $musicPage) {
        data {
          id
          title
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
