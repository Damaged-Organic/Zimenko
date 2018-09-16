import '@config/jquery';

import startLoader from '@components/loader/';
import ContactContainer from '@containers/contactContainer';

startLoader({
    el: '#common-loader-holder',
    time: 1000
});

$(() => new ContactContainer());