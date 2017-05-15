'use strict';

let Memstore = require('./components/store/memory_store');
let ApiServer = require('./components/server/api_server');
let ConversationRepo = require('./components/repo/conversation_repo');
let UserRepo = require('./components/repo/user_repo');

let store = new Memstore();
let convRepo = new ConversationRepo(store);
let userRepo = new UserRepo(store);
let server = new ApiServer(convRepo, userRepo);
server.start(5000);