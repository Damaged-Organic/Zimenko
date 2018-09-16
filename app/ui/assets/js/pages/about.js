import $ from '@config/jquery';

import startLoader from '@components/loader/';
import AboutContainer from '@containers/aboutContainer';

startLoader({
    el: '#common-loader-holder',
    time: 1000
});

$(() => new AboutContainer());