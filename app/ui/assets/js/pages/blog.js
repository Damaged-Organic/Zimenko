import $ from '@config/jquery';

import startLoader from '@components/loader/';
import BlogContainer from '@containers/blogContainer';

startLoader({
    el: '#common-loader-holder',
    time: 1000
});

$(() => new BlogContainer());