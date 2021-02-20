const { exec } = require('child_process')

function postMsg(key, msg) {
	
	let url = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${key}`
	let header = 'Content-Type: application/json'
	
	let cmd = `curl "${url}" -H "${header}" -d '${JSON.stringify(msg)}'`
	
	exec(cmd, function (err, stdout, stderr) {
	})
}

module.exports = postMsg

