# FRONT

## External API

### iTunes Search

- [official](https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/)
- [artist-photos](https://gist.github.com/karlding/954388cb6cd2665d4f3a)
- [pagination](https://stackoverflow.com/questions/44177089/itunes-search-api-page-number-for-the-query)

### Wikipedia

- [official](https://www.mediawiki.org/wiki/API:Main_page)

### ~~Musixmatch~~ lyric return only 30%

- [official](https://developer.musixmatch.com/documentation/api-reference/track-search)
- プチリリに変更したい

### Spotify

- [official](https://developer.spotify.com/)

## Packages

- [axios](https://github.com/axios/axios)
- [axios-jsonp](https://github.com/RekingZhang/axios-jsonp)
- [@material-ui](https://material-ui.com/getting-started/installation/)
- [material-ui-image](https://github.com/TeamWertarbyte/material-ui-image)
- [notistack](https://github.com/iamhosseindhv/notistack)
- [react-query](https://react-query.tanstack.com/installation)
- [react-router-dom](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-dom)
- ~~[react-dropzone](https://github.com/react-dropzone/react-dropzone)~~
- [react-markdown](https://github.com/remarkjs/react-markdown)
- [react-slick](https://github.com/akiran/react-slick)
- [react-use](https://github.com/streamich/react-use)
- [react-script-hook](https://github.com/hupe1980/react-script-hook)
- [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- [redux-toolkit](https://redux-toolkit.js.org/)
- [redux-persist](https://github.com/rt2zz/redux-persist)
- [redux-logger](https://github.com/LogRocket/redux-logger)
- [date-fns](https://github.com/date-fns/date-fns)
- [@coderline/alphatab](https://github.com/coderline/alphaTab)
- [graphql](https://github.com/graphql/graphql-js)
- [graphql-request](https://github.com/prisma-labs/graphql-request)
- [spotify-web-api-js](https://github.com/JMPerez/spotify-web-api-js)
- [why-did-you-render](https://github.com/welldone-software/why-did-you-render)
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
| itunesAlbums    | [itunes, albums, :ids]                                                                                |
| itunesMusic     | [itunes, music, :id]                                                                                  |
| itunesMusics    | [itunes, musics, :ids]                                                                                |
| searchArtists   | [artists, { page, query }]                                                                            |
| searchMusics    | [musics, { page, query }]                                                                             |
| searchBands     | [bands, { page, query }]                                                                              |
| searchAlbums    | [albums, { page, query }]                                                                             |
| wikipedia       | [wikipedia, :id]                                                                                      |
| searchWikipedia | [wikipedia, :query]                                                                                   |
