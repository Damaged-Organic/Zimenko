import $ from '@config/jquery';

import startLoader from '@components/loader/';
import ArticleContainer from '@containers/articleContainer';

startLoader({
    el: '#common-loader-holder',
    time: 1000
});

$(() => new ArticleContainer());