const randomWords = require('random-words')

function generateData() {
	const data = {
		locations: {},
		names: {},
		families: {},
		schools: {},
	}	

	for (let index = 0; index < 1000; index++) {
		data.names[randomWords(2).join(' ')] = Math.round(Math.random() * 5000)
		data.locations[randomWords(3).join(' ')] = Math.round(Math.random() * 5000)
	}

	for (let index = 0; index < 15; index++) {
		data.families[randomWords(2).join(' ')] = Math.round(Math.random() * 400)
	}

	for (let index = 0; index < 4; index++) {
		data.schools[randomWords(2).join(' ')] = Math.round(Math.random() * 100)
	}

	data.names = Object.keys(data.names).map(key => ({ key, doc_count: data.names[key] }))
	data.locations = Object.keys(data.locations).map(key => ({ key, doc_count: data.locations[key] }))
	data.families = Object.keys(data.families).map(key => ({ key, doc_count: data.families[key] }))
	data.schools = Object.keys(data.schools).map(key => ({ key, doc_count: data.schools[key] }))

	return data
}
exports.data = generateData()

exports.sorters = {
	_countasc: (a, b) => {
		if (a.doc_count > b.doc_count) return 1
		if (a.doc_count < b.doc_count) return -1
		return 0
	},
	_countdesc: (a, b) => {
		if (a.doc_count > b.doc_count) return -1
		if (a.doc_count < b.doc_count) return 1
		return 0
	},
	_termdesc: (a, b) => {
		if (a.key > b.key) return -1
		if (a.key < b.key) return 1
		return 0
	},
	_termasc: (a, b) => {
		if (a.key > b.key) return 1
		if (a.key < b.key) return -1
		return 0
	}
}