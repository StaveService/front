import { gql } from "graphql-request";

export const musicQuery = gql`
  query getMusic($id: Int!, $currentUserId: Int!) {
    music(id: $id) {
      id
      title
      musicLink {
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
      artistMusics {
        id
        role
        artist {
          id
          name
        }
      }
      composers {
        id
        name
      }
      lyrists {
        id
        name
      }
      bookmark(currentUserId: $currentUserId) {
        id
      }
    }
  }
`;
export default undefined;
