import '@config/jquery';

import startLoader from '@components/loader/';
import AlbumContainer from '@containers/albumContainer';

startLoader({
    el: '#common-loader-holder',
    time: 1000
});

$(() => new AlbumContainer());