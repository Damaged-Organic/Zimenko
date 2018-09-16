import '@config/jquery';

import startLoader from '@components/loader/';
import LookbookContainer from '@containers/lookbookContainer';

startLoader({
    el: '#common-loader-holder',
    time: 1000
});

$(() => new LookbookContainer());