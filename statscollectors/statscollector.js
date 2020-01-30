
class StatsCollector {

    constructor( crawler ) {
        let self = this
        self._dump = crawler.getSettings().getBoolean('STATS_DUMP')
        self._stats = {}
    }

    getValue( key , defaultValue = null  , spider = null  ) {
        let self = this

        let val = self._stats[key]
        if (!val && defaultValue ) {
            val = defaultValue
        }

        return val
    }

    getStats(spider = null ) {
        return this._stats
    }

    setValue( key , value , spider = null ) {
        self._stats[key] = value
    }

    setStats (stats , spider = null) {
        self._stats = stats
    }

    incValue( key , count = 1 , start = 0 , spider = null  ) {
        let self = this
        let d = self._stats

        d[key] = self._setIntDefault( key  , start ) + count
    }

    maxValue( key , value , spider = null ) {
        let self = this
        self._stats[key] = Math.max(self.setdefault(key, value), value)
    }

    minValue( key , vakue , spider = null) {
        let self = this
        self._stats[key] = Math.min(self.setdefault(key, value), value)
    }

    clearStats(spider = null) {
        let self = this
        delete self._stats
        self._stats = {}
    }

    openSpider ( spider ) {

    }

    closeSpider(spider , reason) {
        let self = this
        if (self._dump) {

            // --- logger message ---

        }

        self._persist_stats( self._stats , spider )
    }

    _setIntDefault(key , value) {
        let self = this
        self._stats[key] = parseInt(value, 10)
    }

    _persis_stats(stats , spider) {

    }

}

module.exports = StatsCollector