import { gql } from "graphql-request";

export const bandQuery = gql`
  query getBand($id: Int!, $currentUserId: Int!) {
    band(id: $id) {
      id
      name
      musics {
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
          nickname
        }
        musicLink {
          itunes
        }
      }
      artists {
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
