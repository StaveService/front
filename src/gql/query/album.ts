import { gql } from "graphql-request";

export const albumQuery = gql`
  query getAlbum($id: Int!, $musicPage: Int!) {
    album(id: $id) {
      id
      title
      albumLink {
        itunes
      }
      musics(musicPage: $musicPage) {
        data {
          id
          title
          musicLink {
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
        }
        pagination {
          totalPages
        }
      }
      artists {
        id
        name
      }
    }
  }
`;
export default undefined;
