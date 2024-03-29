import { gql } from "graphql-request";

const musicQuery = gql`
  query getMusic($id: Int!, $locale: String!, $currentUserId: Int) {
    music(id: $id) {
      id
      title(locale: $locale)
      scoreExist
      localed(locale: $locale)
      link {
        id
        musixmatch
        itunes
        spotify
        youtube
      }
      user {
        id
        nickname
      }
      band {
        id
        name(locale: $locale)
      }
      artistMusics {
        id
        role
        artist {
          id
          name(locale: $locale)
        }
      }
      composers {
        id
        name(locale: $locale)
      }
      lyrists {
        id
        name(locale: $locale)
      }
      albums {
        id
        title(locale: $locale)
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
