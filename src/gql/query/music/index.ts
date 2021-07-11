import { gql } from "graphql-request";

const musicQuery = gql`
  query getMusic($id: Int!, $currentUserId: Int) {
    music(id: $id) {
      id
      title
      scoreExist
      link {
        id
        itunes
        musixmatch
        spotify
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
      albums {
        id
        title
        link {
          itunes
        }
      }
      bookmark(currentUserId: $currentUserId) {
        id
      }
      bookmarksCount
    }
  }
`;

export default musicQuery;
