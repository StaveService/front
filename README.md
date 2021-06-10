# FRONT

## External API

### iTunes Search API

- [official](https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/)
- [artist-photos](https://gist.github.com/karlding/954388cb6cd2665d4f3a)
- [pagination](https://stackoverflow.com/questions/44177089/itunes-search-api-page-number-for-the-query)

## Packages

- [axios](https://github.com/axios/axios)
- [@material-ui](https://material-ui.com/getting-started/installation/)
- [material-ui-image](https://github.com/TeamWertarbyte/material-ui-image)
- [notistack](https://github.com/iamhosseindhv/notistack)
- [react-query](https://react-query.tanstack.com/installation)
- [react-router-dom](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-dom)
- [react-dropzone](https://github.com/react-dropzone/react-dropzone)
- [redux-toolkit](https://redux-toolkit.js.org/)
- [redux-persist](https://github.com/rt2zz/redux-persist)
- [redux-logger](https://github.com/LogRocket/redux-logger)
- [date-fns](https://github.com/date-fns/date-fns)
- [@coderline/alphatab](https://github.com/coderline/alphaTab)
- [graphql](https://github.com/graphql/graphql-js)
- [graphql-request](https://github.com/prisma-labs/graphql-request)

custom-hooks

- [react-use](https://github.com/streamich/react-use)
- [react-script-hook](https://github.com/hupe1980/react-script-hook)
- ~~[use-http](https://github.com/ava/use-http)~~ can't use multiple url

## ReactQuery Key Pattern

| type            | key                                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| artist          | [artist, :id, { musicPage, albumPage }]                                                               |
| artists         | [artists, :page]                                                                                      |
| album           | [album, :id]                                                                                          |
| albums          | [albums, :page]                                                                                       |
| band            | [band, :id]                                                                                           |
| bands           | [bands, :page, { musicPage, albumPage }]                                                              |
| music           | [music, :id]                                                                                          |
| musics          | [musics, :page]                                                                                       |
| user            | [<br>user, :id,<br> { musicPage, bookmarkedMusicPage, bookmarkedArtistPage, bookmarkedBandPage }<br>] |
| users           | [users, :page]                                                                                        |
| itunesArtist    | [itunes, artist, :id]                                                                                 |
| itunesAlbum     | [itunes, album, :id]                                                                                  |
| itunesAlbums    | [itunes, albums, :id]                                                                                 |
| itunesMusic     | [itunes, music, :id]                                                                                  |
| itunesMusics    | [itunes, musics, :ids]                                                                                |
| searchArtists   | [artists, { page, query }]                                                                            |
| searchMusics    | [musics, { page, query }]                                                                             |
| searchBands     | [bands, { page, query }]                                                                              |
| searchAlbums    | [albums, { page, query }]                                                                             |
| wikipedia       | [wikipedia, :id]                                                                                      |
| searchWikipedia | [wikipedia, :query]                                                                                   |
