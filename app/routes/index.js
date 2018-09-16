const hbs = require('hbs');
const Celebrate = require('celebrate');
const moment = require('moment');

const { asyncHandler } = require('@routes/errors');
const {
    throwNotFoundException, throwInternalServerErrorException,
} = require('@routes/exceptions/http');
const { contactsPostValidator } = require('@routes/validators/contacts');

const Meta = require('@models/mongoose/Meta');
const AboutUs = require('@models/mongoose/AboutUs');
const Article = require('@models/mongoose/Article');
const ArticleBlock = require('@models/mongoose/ArticleBlock');
const LookbookIntro = require('@models/mongoose/LookbookIntro');
const LookbookCategory = require('@models/mongoose/LookbookCategory');
const Lookbook = require('@models/mongoose/Lookbook');
const Contact = require('@models/mongoose/Contact');

const { sendMailHtml } = require('@services/mailing');

const findMeta = async (req, res) => {
    return Meta.i18nInit(req, res).findOne({ route: req.route.name });
};

const findLookbookCategories = async (req, res) => {
    return LookbookCategory.i18nInit(req, res).find();
};

const index = asyncHandler(async (req, res) => {
    const lookbookIntro = await LookbookIntro.findOne().limit(1);

    if( !lookbookIntro )
        throwInternalServerErrorException(
            'In order to display correctly Lookbook Intro should be created'
        );

    res.render('index', {
        meta: await findMeta(req, res),
        lookbookIntro: lookbookIntro,
        lookbookCategories: await findLookbookCategories(req, res),
    });
});
index.route = {
    path: '/',
    name: 'index',
};

const about = asyncHandler(async (req, res) => {
    const about = await AboutUs.i18nInit(req, res).findOne().limit(1);

    if( !about )
        throwInternalServerErrorException(
            'In order to display correctly About Us block should be created'
        );

    res.render('about', {
        meta: await findMeta(req, res),
        about: about,
    });
});
about.route = {
    path: '/about',
    name: 'about',
};

const blog = asyncHandler(async (req, res) => {

    let articles = await Article.i18nInit(req, res).paginate(req, null, null, {
        sort: { updatedAt: -1 },
    });

    if( articles === false )
        throwNotFoundException('Pagination error: such page does not exist!');

    if( articles.length === 0 )
        throwInternalServerErrorException(
            'In order to display correctly at least one Article should be created');

    res.render('blog', {
        meta: await findMeta(req, res),
        model: Article,
        route: 'blog',
        articles: articles,
    });
});
blog.route = {
    path: '/blog/:page(\\d+)?',
    name: 'blog',
};

const blogArticle = asyncHandler(async (req, res) => {
    const article = await Article.i18nInit(req, res).findOne({ slug: req.params.slug });

    if( !article )
        throwNotFoundException('Such Article does not exist!');

    let conditions = { article: article },
        projection = [],
        options = { sort: { order: 1 } };

    const articleBlocks = await ArticleBlock.i18nInit(req, res).find(conditions, projection, options);

    const articles = await Article.find();

    // @abomination
    let articleIndex = 0;
    articles.some((item, index) => {
        let condition = article._id.equals(item._id);
        if (condition) articleIndex = index + 1;
        return condition;
    });

    const page = Math.ceil(articleIndex / Article.schema.perPage);
    // end\@abomination

    const [ prevArticle, nextArticle ] = await Promise.all([
        Article.find({ _id: { $lt: article._id } }, 'createdAt slug').sort({ _id: -1 }).limit(1),
        Article.find({ _id: { $gt: article._id } }, 'createdAt slug').sort({ _id: 1 }).limit(1),
    ]);

    res.render('blog_article', {
        meta: await findMeta(req, res),
        article: article,
        articleBlocks: articleBlocks,
        prevArticle: prevArticle[0],
        nextArticle: nextArticle[0],
        page: page,
    });
});
blogArticle.route = {
    path: '/blog/:datestamp([0-9\-]+)/:slug([0-9a-zA-Z\-]+)',
    name: 'blogArticle',
};

const lookbook = asyncHandler(async (req, res) => {
    let conditions = {};

    if (req.query.category) {
        const lookbookCategory = await LookbookCategory.findOne({ 'slug': req.query.category });

        if (!lookbookCategory)
            throwNotFoundException('Such Lookbook Category does not exist!');

        conditions = { 'lookbookCategory': lookbookCategory._id }

    } else{

        conditions = { 'isPreview': true }
    }

    const lookbooks = await Lookbook.i18nInit(req, res).paginate(req, conditions, null, {
        sort: { updatedAt: -1 },
    });

    if( lookbooks === false )
        throwNotFoundException('Pagination error: such page does not exist!');

    if( lookbooks.length === 0 )
        throwInternalServerErrorException(
            'In order to display correctly at least one Lookbook should be created');

    res.cookie('backUrl', req.originalUrl);

    res.render('lookbook', {
        meta: await findMeta(req, res),
        model: Lookbook,
        route: 'lookbook',
        category: req.query.category,
        lookbooks: lookbooks,
        lookbookCategories: await findLookbookCategories(req, res),
        backUrl: req.originalUrl
    });
});
lookbook.route = {
    path: '/lookbook/:page(\\d+)?',
    name: 'lookbook',
};

const lookbookAlbum = asyncHandler(async (req, res) => {
    const lookbook = await Lookbook.i18nInit(req, res).findOne({ slug: req.params.slug });

    if( !lookbook )
        throwNotFoundException('Such Lookbook does not exist!');

    if(req.cookies.backUrl)
        res.app.locals.backUrl = req.cookies.backUrl;

    res.render('lookbook_album', {
        meta: await findMeta(req, res),
        lookbook: lookbook,
    });
});
lookbookAlbum.route = {
    path: '/lookbook/:datestamp([0-9\-]+)/:slug([0-9a-zA-Z\-]+)',
    name: 'lookbookAlbum',
};

const contactsGet = asyncHandler(async (req, res) => {
    const contacts = await Contact.i18nInit(req, res).find();

    if( contacts.length === 0 )
        throwInternalServerErrorException(
            'In order to display correctly at least one Contact should be created');

    res.render('contacts', {
        meta: await findMeta(req, res),
        contacts: contacts,
    });
});
contactsGet.route = {
    path: '/contacts',
    name: 'contacts',
};

const contactsPost = asyncHandler(async (req, res) => {
    const { name, email, message } = req.body;

    const feedbackHbs = hbs.handlebars.compile(hbs.handlebars.partials['letters/feedback']);

    const feedbackHtml = feedbackHbs({
        feedback: {
            name,
            email,
            message,
            timestamp: moment().locale('ru').format('LLL'),
        }
    });

    const error = await sendMailHtml(feedbackHtml);

    if (error)
        return res.status(500).json({ message: res.__('error_500') });

    res.status(200).json({
        message: res.__('Your message successfully sent, our manager will contact you as soon as possible.'),
    });
});
contactsPost.route = {
    path: '/contacts/send',
    name: 'contacts_send',
};

module.exports = (router) => {
    return router
        .get(
            index.route.path,
            index.route.name,
            index)
        // About
        .get(
            about.route.path,
            about.route.name,
            about)
        // Blog
        .get(
            blog.route.path,
            blog.route.name,
            blog)
        .get(
            blogArticle.route.path,
            blogArticle.route.name,
            blogArticle)
        // Lookbook
        .get(
            lookbook.route.path,
            lookbook.route.name,
            lookbook)
        .get(
            lookbookAlbum.route.path,
            lookbookAlbum.route.name,
            lookbookAlbum)
        // Contacts
        .get(
            contactsGet.route.path,
            contactsGet.route.name,
            contactsGet)
        .post(
            contactsPost.route.path,
            contactsPost.route.name,
            Celebrate(contactsPostValidator),
            contactsPost);
};
