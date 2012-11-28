# monget
a commandline tool to run mongo queries to stdout

## Installation

    npm install -g monget

## Usage

    $ node monget --conn <connection string> <mongo shell javascript command>

Options:

    -c, --conn  a mongodb connection string (see http://www.mongodb.org/display/DOCS/Connections)
    -s, --save  save the connection to a .monget file in the current directory                     [boolean]

Example:

    monget --conn mongodb://localhost/myDB "db.users.findOne()" > user.json

monget requires a [mongodb connection string](http://www.mongodb.org/display/DOCS/Connections). From the mongo docs:

    mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]

eg

    mongodb://localhost/myDb

If no connection string is passed in the `--conn` argument, monget will check for a connection string in a file called `.monget`. You can call monget with the `--save` flag to save the connection string argument to the .monget file for convenience.

## Shell-friendly syntax!

The things you're going to want to do in the mongoshell are run one-liner queries. As such, we make things easier for you:

 - Automatically prefix commands with `db.`
 - Automatically append `()` if you don't explicitly invoke a method
 - Automatically call `.shellPrint()` for `.find` (default mongoshell interactive behavior)

This means you can either write

    $ monget "db.MyCollection.findOne()"

(note the quotes necessary in Bash when using parentheses)

or

    $ monget MyCollection.findOne

We're here to make your life easier, because we love you.

## License
Written by Jason Denizac <jason@denizac.org>

Copyright 2012 Agile Diagnosis, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.