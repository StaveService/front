import { gql } from "graphql-request";

const albumMusicsQuery = gql`
  query getAlbumMusics($id: Int!, $musicPage: Int!, $locale: String!) {
    album(id: $id) {
      musics(musicPage: $musicPage) {
        data {
          id
          title(locale: $locale)
          link {
            itunes
            spotify
          }
          band {
            name(locale: $locale)
          }
          composers {
            id
            name(locale: $locale)
          }
          lyrists {
            id
            name(locale: $locale)
          }
        }
        pagination {
          totalPages
        }
      }
    }
  }
`;
export default albumMusicsQuery;
