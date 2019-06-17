

function ItemPipelineManager() {

    var component_name = "item pipeline";

    var self = this;

    function processItem(item , spider) {
        _process_chain("process_item" , item, spider );
    }
    self.processItem = processItem;


    function openSpider(spider) {

    }
    self.openSpider = openSpider;


    // ---- private method ----
    function _get_mwlist_from_settings(settings) {

    }

    function _add_middleware(pipe) {

    }

}

/**
 * create manager
 * @param crawler
 */
ItemPipelineManager.fromCrawler = function(crawler) {

    var inst = new ItemPipelineManager();

    return inst;

}


module.exports.ItemPipelineManager = ItemPipelineManager;
