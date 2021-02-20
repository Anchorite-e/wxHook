const Http = require('http')
const Url = require('url')

const proxy = require('./Proxy')


class Server {
	constructor(port) {
		this.startServer(port)
		
	}
	
	startServer(port) {
		let server = Http.Server()
		
		server.on('request', (req, res) => {
			let data = ''
			
			let { path } = Url.parse(req.url, true)
			
			path = path.replace('/', '')
			
			req.setEncoding('utf-8')
			
			req.on('data', chunk => {
				data += chunk
			})
			
			req.on('end', () => {
				path && proxy({ key: path, data })
			})
			
			res.end()
		})
		
		server.listen(port)
	}
}

module.exports = Server
