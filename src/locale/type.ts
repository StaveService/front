import IUiMessages from "../ui/locale/type";

type IMessages = Record<
  | "album"
  | "albums"
  | "account"
  | "addArtist"
  | "addAlbum"
  | "artist"
  | "artists"
  | "alertDelete"
  | "beFollowed"
  | "beBookmarked"
  | "band"
  | "bands"
  | "create"
  | "composer"
  | "composers"
  | "contact"
  | "createArtist"
  | "createAlbum"
  | "createMusic"
  | "createBand"
  | "createIssue"
  | "delete"
  | "description"
  | "editAlbum"
  | "editInfo"
  | "edit"
  | "followUs"
  | "follower"
  | "following"
  | "unfollowUs"
  | "file"
  | "issues"
  | "link"
  | "lyric"
  | "lyrists"
  | "info"
  | "main"
  | "music"
  | "musics"
  | "name"
  | "noNotification"
  | "pleaseTranslate"
  | "pleaseType"
  | "profile"
  | "role"
  | "releaseDate"
  | "searchByItunes"
  | "searchIssues"
  | "setting"
  | "title"
  | "translateTitle"
  | "users"
  | "user"
  | "untranslation"
  | "watchScore",
  string
> &
  IUiMessages;
export default IMessages;