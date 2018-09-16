import $ from '@config/jquery';

import startLoader from '@components/loader/';
import HomeContainer from '@containers/homeContainer';

startLoader({
    el: '#loader-holder',
    time: 2000
});

$(() => new HomeContainer());