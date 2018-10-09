const path = require('path')
const express = require('express')
const reload = require('reload')
const { sorters, data } = require('./data')

const app = express()
app.disable('x-powered-by')

app.use(express.static(path.resolve(process.cwd(), './node_modules')))
app.use(express.static(process.cwd()))
app.use(express.json())

app.get('/', (_req, res) =>  {
	res.sendFile(path.join(process.cwd(), '/examples/index.html'))
})

app.post('/api/search', (req, res) => {
	const { facets } = req.body
	Object.keys(facets)
		.forEach(key => {
			const facet = facets[key]
			if (facet.type === 0) {
				const values = facet.query.length ?
					data[key].filter(value => value.key.indexOf(facet.query) > -1) :
					data[key]
				facet.values = values.sort(sorters[facet.order.join('')]).slice(0, facet.viewSize)
				facet.total = values.length
			} else if (facet.field === 'numbers' ) {
				facet.values = [100, 2000]
				facet.histogramValues = getHistogramValues(100, 2000)
			} else if (facet.field === 'dates' ) {
				facet.values = [Date.UTC(1568, 0), Date.UTC(1648, 0)]
				facet.histogramValues = getHistogramValues(1568, 1648, 'cos', 2)
			}
		})
	res.json(req.body.facets)
})

reload(app)

const PORT = 3333
app.listen(PORT)
console.log(`Listening on port ${PORT}`)


function getHistogramValues(min, max, func, period) {
	if (func == null) func = 'sin'
	if (period == null) period = 2

	const histogramValues = []
	for (let index = min; index <= max; index++) {
		histogramValues.push({
			key: index,
			doc_count: Math.abs(Math[func](period * Math.PI * (index - min) / (max - min))),
		})					
	}

	return histogramValues
}