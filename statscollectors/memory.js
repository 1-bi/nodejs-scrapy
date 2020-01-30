
const StatsCollector = require('./statscollector')

class MemoryStatsCollector extends StatsCollector{

    constructor( crawler ) {
        super( crawler )
        let self = this
        self._spiderStats = {}
    }

    _persis_stats(stats , spider) {
        let self = this
        self._spiderStats[spider.name] = stats
    }


}

module.exports = MemoryStatsCollector