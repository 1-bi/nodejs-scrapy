
const StatsCollector = require('./statscollector')

class DummyStatsCollector extends StatsCollector {

    getValue( key , defaultValue = null , spider) {
        return defaultValue
    }

    setValue( key , value , spider ) {

    }

    setStats( stats , spider) {

    }

    incValue(key, count=1, start=0, spider ) {

    }

    maxValue( key, value, spider ) {

    }

    minValue( key , value , spider) {

    }

}

module.exports = DummyStatsCollector