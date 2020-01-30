
const Settings = require('./settings/settings')
const CrawlerRunner = require('./crawlerrunner')


/**
 *
 A class to run multiple scrapy crawlers in a process simultaneously.
 This class extends :class:`~scrapy.crawler.CrawlerRunner` by adding support
 for starting a :mod:`~twisted.internet.reactor` and handling shutdown
 signals, like the keyboard interrupt command Ctrl-C. It also configures
 top-level logging.
 This utility should be a better fit than
 :class:`~scrapy.crawler.CrawlerRunner` if you aren't running another
 :mod:`~twisted.internet.reactor` within your application.
 The CrawlerProcess object must be instantiated with a
 :class:`~scrapy.settings.Settings` object.
 :param install_root_handler: whether to install root logging handler
 (default: True)
 This class shouldn't be needed (since Scrapy is responsible of using it
 accordingly) unless writing scripts that manually handle the crawling
 process. See :ref:`run-from-script` for an example.
 *
 */
class CrawlerProcess extends CrawlerRunner{


    constructor(settings = null, install_root_handler = true) {
        super( settings )
        //install_shutdown_handlers(self._signal_shutdown)
       // configure_logging(self.settings, install_root_handler)
        //log_scrapy_info(self.settings)
    }

    /**
     *
     *         This method starts a :mod:`~twisted.internet.reactor`, adjusts its pool
     size to :setting:`REACTOR_THREADPOOL_MAXSIZE`, and installs a DNS cache
     based on :setting:`DNSCACHE_ENABLED` and :setting:`DNSCACHE_SIZE`.
     If ``stop_after_crawl`` is True, the reactor will be stopped after all
     crawlers have finished, using :meth:`join`.
     :param boolean stop_after_crawl: stop or not the reactor when all
     *
     * @param stop_after_crawl
     */
    start( stop_after_crawl = true  ) {

    }

    // ------------------- private method ---------------------
    _signal_shutdown( signum ) {

    }

    _signal_kill( signum ) {

    }

    _get_dns_resolver() {

    }

    _graceful_stop_reactor() {

    }

    _stop_reactor() {

    }

    _handle_asyncio_reactor() {

    }

}

module.exports = CrawlerProcess