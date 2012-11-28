var opt = require('optimist');
var fs = require('fs');
var url = require('url');
var spawn = require('child_process').spawn;
var S = require('string');
var monconn = require('monconn');

var opt = opt
	.usage('Usage: $0 [--conn] "mongoshell javascript"')
	.demand(['_'])
	.alias('c','conn')
	.describe('c','a mongodb connection string (see http://www.mongodb.org/display/DOCS/Connections)')
	.boolean('s')
	.alias('s','save')
	.describe('s','save the connection to a .monget file in the current directory');


getConnectionString(function (err, connectionString) {
	if (err) return onError(err);

	var connectionInfo = monconn(connectionString);

	var command = formatMongoShellCommand(opt.argv._);

	runMongoCommand(connectionInfo, command);
});


//requires mongoshell 2.0.x

function runMongoCommand(connectionInfo, cmd, cb) {

	var args = [];

	args.push(formatConnectionInfoForMongoShell(connectionInfo));

	if (connectionInfo.user)
		args.push('-u', connectionInfo.user);

	if (connectionInfo.pass)
		args.push('-p', connectionInfo.pass);

	args.push('--quiet');
	args.push('--eval', 'printjson(' + cmd + ')');

	var mongo = spawn('mongo', args);
	mongo.stdout.pipe(process.stdout);
	mongo.stderr.pipe(process.stderr);
}

function getConnectionString(cb) {
	var file = '.monget';
	if (opt.argv.conn) {
		if (opt.argv.save) {
			fs.writeFile(file, opt.argv.conn, function (err) {
				cb(err, opt.argv.conn);
			});
		} else {
			cb(null, opt.argv.conn);
		}
	} else {

		fs.exists(file, function (exists) {
			if (!exists) {
				return cb('.monget file not found and no --conn specified!');
			}
			fs.readFile(file, 'utf8', cb);
		});
	}
}

function formatConnectionInfoForMongoShell(connectionInfo) {
	var str = connectionInfo.host;
	if (connectionInfo.port) {
		str = str + ':' + connectionInfo.port;
	}
	if (connectionInfo.db) {
		str = str + '/' + connectionInfo.db;
	}
	return str;
}

function onError(err) {
	opt.showHelp();
	console.error(err.message);
	process.exit(1);
}


function formatMongoShellCommand(cmd) {
	if (!S(cmd).startsWith('db.')) cmd = 'db.' + cmd;
	if (S(cmd).endsWith(';')) cmd = cmd.substr(0, cmd.length-1);

	var find = /\.find$|\.find\(.*\)$/;
	var isMethod = /\(.*\)$/;

	if (find.test(cmd)) {
		if (!isMethod.test(cmd)) cmd = cmd + '()';
		cmd = cmd + '.shellPrint()';
	}


	if (!isMethod.test(cmd)) cmd = cmd + '()';
	return cmd;
}