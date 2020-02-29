const utils = require('./utils')
const core = require('./core')
const Settings = require('./settings/settings')
const Crawler = require('./crawler')

/**
 *
 * This is a convenient helper class that keeps track of, manages and runs
 * crawlers inside an already setup :mod:`~twisted.internet.reactor`.
 * The CrawlerRunner object must be instantiated with a
 * :class:`~scrapy.settings.Settings` object.
 * This class shouldn't be needed (since Scrapy is responsible of using it
 * accordingly) unless writing scripts that manually handle the crawling
 * process. See :ref:`run-from-script` for an example.
 *
 */
class CrawlerRunner {

    constructor( settings = null ){
        let self = this

        if ( !settings ) {

            settings = new Settings({})
        }

        self._settings = settings
        self._spiderLoader = self._get_spider_loader(settings)
        self._crawlers = []
        self._active = []
        self._bootstrap_failed = false
    }

    spiders() {
        return this._spiderLoader
    }

    /**
     *
     * Run a spider with the provided arguments.
     It will call the given Crawler's :meth:`~Crawler.crawl` method, while
     keeping track of it so it can be stopped later.
     If ``crawler_or_spidercls`` isn't a :class:`~scrapy.spider.Crawler`
     instance, this method will try to create one using this parameter as
     the spider class given to it.
     Returns a deferred that is fired when the crawling is finished.
     :param crawler_or_spidercls: already created spider, or a spider class
     or spider's name inside the project to create it
     :type crawler_or_spidercls: :class:`~scrapy.spider.Crawler` instance,
     :class:`~scrapy.core.Spider` subclass or string
     :param list args: arguments to initialize the spider
     :param dict kwargs: keyword arguments to initialize the spider
     *
     *
     * @param crawler_or_spidercls
     * @param args
     * @param kwargs
     */
    crawl( crawler_or_spidercls, args, kwargs ) {
        let self = this
        let crawler = self.createCrawler(crawler_or_spidercls)
        self._crawl( crawler , args , kwargs )
    }


    _crawl( crawler , args, kwargs ) {
        let self = this
        self._crawlers.push( crawler )
        let d = crawler.crawl( args, kwargs )
        self._active.push( d )

        let _done = function(result) {
            let loc = self._crawlers.indexOf( crawler )
            if (loc > -1) {
                delete self._crawlers[loc]
            }
            //self._crawlers.discard( crawler )
            return result
        }
        return d.addBoth( _done )


    }

    /**
     *        Return a :class:`~scrapy.spider.Crawler` object.
     * If ``crawler_or_spidercls`` is a Crawler, it is returned as-is.
     * If ``crawler_or_spidercls`` is a Spider subclass, a new Crawler
     is constructed for it.
     * If ``crawler_or_spidercls`` is a string, this function finds
     a spider with this name in a Scrapy project (using spider loader),
     then creates a Crawler instance for it.     * @param crawler_or_spidercls
     */
    createCrawler( crawler_or_spidercls ) {
        let self = this

        if (crawler_or_spidercls instanceof core.Spider) {
            throw new Error('The crawler_or_spidercls argument cannot be a spider object, it must be a spider class (or a Crawler object)' )
        }

        if (crawler_or_spidercls instanceof Crawler) {
            return  crawler_or_spidercls
        }
        return self._create_crawler( crawler_or_spidercls )
    }


    _create_crawler(spidercls) {
        let self = this
        if ( typeof(spidercls) === "string") {
            spidercls = self._spiderLoader.load( spidercls )
        }
        return new Crawler(spidercls, self._settings)
    }


    /**
     * get spider loader
     * @param settings Settings
     * @private
     */
    _get_spider_loader ( settings ) {

        let self = this
        let clsPath = settings.getProperty('SPIDER_LOADER_CLASS')
        let loader_cls = utils.loadObjectCls( clsPath )

        try {

        } catch (e) {

        }

        return
    }

}


module.exports = CrawlerRunner