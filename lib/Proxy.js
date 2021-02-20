const postMsg = require('./HookMsg')

function proxyMsg(data) {
	try {
		data = typeof data === 'string' ? JSON.parse(data) : data
	} catch (e) {
		data = {}
	}
	let content
	switch (data.object_kind) {
		case 'push':
			content = assemblePushMsg(data)
			break
		case 'merge_request':
			content = assembleMergeMsg(data)
			break
		case 'tag_push':
			content = assembleTagPushMsq(data)
			break
		default:
			content = []
	}
	
	return content
	
}


function assemblePushMsg({ user_name, ref, project, commits, total_commits_count, before, after }) {
	const { name: projName, web_url } = project || {}
	
	const branch = ref.replace('refs/heads/', '')
	
	let content = []
	let operate
	
	if (before === '0000000000000000000000000000000000000000') {
		operate = '新建分支'
	} else if (after === '0000000000000000000000000000000000000000') {
		operate = '删除分支'
	} else {
		operate = '将代码推至'
	}
	
	content.push(`**${user_name} ${operate} [[${branch}](${web_url}/tree/${branch})]**`)
	content.push(`> 项目 [[${projName}](${web_url})]\n`)
	total_commits_count && content.push(`**共提交${total_commits_count}次：**\n`)
	total_commits_count && content.push(generateListItem('', formatCommits(commits).text))
	
	return content
}

function assembleMergeMsg({ user, project, object_attributes }) {
	let content = []
	const { name } = user || {}
	const {
		iid: mrId, url: mrUrl,
		target_branch,
		source_branch,
		state,
		title,
	} = object_attributes || {}
	const { name: projName, web_url } = project || {}
	
	let stateString = '', stateEnding = ''
	switch (state) {
		case 'opened':
			stateString = '开启了'
			stateEnding = '，**请项目管理员确认**'
			break
		
		case 'closed':
			stateString = '取消了'
			stateEnding = '，**请提交人仔细检查**'
			break
		
		case 'locked':
			stateString = '锁定了'
			break
		
		case 'merged':
			stateString = '确认了'
			break
		
	}
	
	content.push(`\`${name}\`**${stateString}**[[#${mrId}合并请求 ${title}](${mrUrl})]，\`${source_branch}\`合并至\`${target_branch}\`${stateEnding}`)
	content.push(`> 项目 [[${projName}](${web_url})]\n`)
	return content
}


function assembleTagPushMsq({ ref, user_name, project, message, commits, total_commits_count, before, after }) {
	const { name: projName, web_url, path_with_namespace } = project || {}
	
	const tag = ref.replace('refs/tags/', '')
	let content = []
	let operate = ''
	
	if (before === '0000000000000000000000000000000000000000') {
		operate = '新增'
	} else if (after === '0000000000000000000000000000000000000000') {
		operate = '删除'
	}
	
	content.push(`**\`${user_name}\`${operate}标签[[${path_with_namespace}/${tag}](${web_url}/-/tags/${tag})]**`)
	content.push(`> 项目 [[${projName}](${web_url})]\n`)
	
	message && content.push(generateListItem('说明', message))
	total_commits_count && content.push(`**共提交${total_commits_count}次：**\n`)
	total_commits_count && content.push(generateListItem('', formatCommits(commits).text))
	return content
}


function generateListItem(label, text, url) {
	if (label) label = label + ':'
	
	if (url) {
		return `>${label} [${text}](${url})`
	} else {
		return `>${label} ${text}`
	}
}

function formatCommits(commits) {
	const changes = { added: 0, modified: 0, removed: 0 }
	const result = {
		commits: commits.map(commit => {
			const { author, url, added, modified, removed } = commit
			let { message } = commit
			changes.added += added.length || 0
			changes.modified += modified.length || 0
			changes.removed += removed.length || 0
			
			message = message.split('\n')[0]
			
			return `${author.name}: [${message}](${url})`
		}), changes,
	}
	
	result.text = `新增: \`${result.changes.added}\` `
		+ `修改: \`${result.changes.modified}\` `
		+ `删除: \`${result.changes.removed}\` \n `
		+ result.commits.join('\n')
	
	
	return result
}


function proxy({ key, data }) {
	let content = proxyMsg(data)
	if (content.length) {
		postMsg(key, {
			msgtype : 'markdown',
			markdown: { content: content.join(' \n  ') },
		})
	}
}

module.exports = proxy

