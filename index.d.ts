// Type definitions for botkit v0.5.4
// Project: https://github.com/howdyai/botkit/

declare interface convoCallBackComplex<M extends BotKitMessage> {
  pattern?: string | RegExp;
  default?: boolean;
  callback: (response: any, convo: BotKitConversation<M>) => void;
}

declare interface BotKitUtterances {
  yes: RegExp,
  no: RegExp,
  quit: RegExp
}

declare interface BotKitMiddleware<M extends BotKitMessage, W extends BotKitWorker<M>> {
  send: {
    use (fn: (bot: W, message: M, next: () => void ) => void ): void;
  };
  receive: {
    use (fn: (bot: W, message: M, next: () => void ) => void ): void;
  };
  spawn: Function;
  heard: {
    use (fn: (bot: W, message: M, next: () => void ) => void ): void;
  };
  capture: {
    use (fn: (bot: W, message: M, convo: BotKitConversation<M>, next: () => void ) => void ): void;
  };
}

declare interface BotKitStorage {
  teams: {
    get: (team_id: any, cb: (error: any, team: any) => void) => void;
    save: (user: any, cb: (error: any, team_id: any) => void) => void;
    all: (cb: (error: any, teams: Array<any>) => void) => void;
  };
  users: {
    get: (user_id: any, cb: (error: any, user: any) => void) => void;
    save: (user: any, cb: (error: any, user_id: any) => void) => void;
    all: (cb: (error: any, users: Array<any>) => void) => void;
  };
  channels: {
    get: (channel_id: any, cb: (error: any, channel: any) => void) => void;
    save: (channel: any, cb: (error: any, channel_id: any) => void) => void;
    all: (cb: (error: any, channels: Array<any>) => void) => void;
  };
}

declare interface BotKitConversation<M extends BotKitMessage> {
  // constructor(task: any, message: any);
  messages: Array<any>;
  sent: Array<any>;
  transcript: Array<any>;
  context: {
    user: any;
    channel: any;
    bot: any; //task.bot
  };
  events: any;
  vars: any;
  threads: any;
  thread: any;
  status: string;
  task: BotKitTask<M>;
  source_message: M;
  handler: any;
  responses: any;
  capture_options: any;
  startTime: Date;
  lastActive: Date;
  collectResponse(key: string, value: any): void;
  capture(response:any, cb?: (response: any) => void): void;
  handle(message: M): void;
  setVar(field: string, value: any): void;
  activate(): void;
  isActive(): boolean;
  deactivate(): void;
  say(message: M|string): void;
  sayFirst(message: M|string): void;
  on(event: string[]|string, cb: (convo: BotKitConversation<M>) => void): this;
  trigger(event: string, data: any): void;
  next(): void;
  repeat(): void;
  silentRepeat(): void;
  addQuestion(message: M|string, cb: ((response: any, convo: BotKitConversation<M>) => void) | (convoCallBackComplex<M>[]), capture_options?: any, thread?: any): void;
  ask(message: M|string, cb: ((response: any, convo: BotKitConversation<M>) => void) | (convoCallBackComplex<M>[]), capture_options?: any): void;
  addMessage(message: M|string, thread: any): void;
  setTimeout(timeout: any): void;
  changeTopic(topic: any): void;
  hasThread(thread: any): boolean;
  transitionTo(thread: any, message: M|string): void;
  gotoThread(thread: any): void;
  combineMessages(messages: Array<M>): string;
  getResponses(): any;
  getResponsesAsArray(): Array<any>;
  extractResponses(): any;
  extractResponse(key: string): any;
  replaceAttachmentTokens(attachments: Array<any>): Array<any>;
  replaceTokens(text: string): string;
  stop(status?: string): void;
  successful(): boolean;
  cloneMessage(message: M): M;
  tick(): void;
}

declare interface BotKitTask<M extends BotKitMessage> {
  // constructor(bot: any, message: any, botkit: any);
  convos: Array<any>;
  botkit: any;
  bot: any;
  events: any;
  source_message: M;
  status: string;
  startTime: Date;

  isActive(): boolean;
  createConversation(message: M): BotKitConversation<M>;
  startConversation(message: M): BotKitConversation<M>;
  conversationEnded(convo: BotKitConversation<M>): void;
  endImmediately(reason: any): void;
  taskEnded(): void;
  on(event: string, cb: any): BotKitTask<M>;
  trigger(event: string, data: any): void;
  getResponsesByUser(): any;
  getResponsesBySubject(): any;
  tick(): void;
}

declare interface BotKitMessage {
  user?: any;
  channel?: any;
  text?: string;
  type?: string;
  attachment?: any;
  attachments?: any;
  match?: any;
  capture_options?: any;
  handler?: Function;
  action?: string; // function | repeat | wait | stop | timeout
  [prop: string]: any;
}

declare interface BotKitWorker<M extends BotKitMessage> {
  identity: {
    id: any;
    name: string;
  };
  type: string;
  botkit: ConsoleBot;
  config: any;
  utterances: BotKitUtterances;
  startConversation(message: M, cb?: (response: any, convo: BotKitConversation<M>) => void): void;
  createConversation(message: M, cb?: (response: any, convo: BotKitConversation<M>) => void): void;
  send(message: M, cb?: (error: any, rawMessage: M) => void ): void;
  reply(src: M, resp: any, cb?: (error: any, rawMessage: M) => void ): void;
  findConversation(message: M, cb?: (convo: BotKitConversation<M>) => void): void;
}

declare interface CoreBot<M extends BotKitMessage, W extends BotKitWorker<M>> {
  events: any;
  config: any;
  tasks: Array<any>;
  taskCount: number;
  convoCount: number;
  my_version: any;
  my_user_agent: any;
  // memory_store: {
  //   users: any;
  //   channels: any;
  //   teams: any;
  // };

  utterances: BotKitUtterances;
  middleware: BotKitMiddleware<M, W>;
  storage: BotKitStorage;

  hears_regexp(tests: Array<any>, message: M): boolean;
  changeEars(new_test: (tests: (string|RegExp)[], message: M) => boolean ): void;
  hears(keywords: Array<any>|String, events: Array<any>|String, testfunction_or_cb: (bot: W, message: M) => void, cb?: (bot: W, message: M) => void ): W;
  on(event: Array<any>|String, cb: (bot: W, object: any) => void): this;
  trigger(event: Array<any>|String, data: any): void;
  startConversation(bot: W, message: M, cb: any): void;
  createConversation(bot: W, message: M, cb: any): void;
  // defineBot(unit: (bot: CoreBot, config: any) => any): void;
  spawn(configuration?: any, cb?: any): W;
  startTicking(): void;
  shutdown(): void;
  startTask(bot: W, message: M, cb: any): BotKitTask<M>;
  receiveMessage(bot: W, message: M): void;
  tick(): void;
  userAgent(): any; //user agent
  version(): string;
  log(...args: any[]): void;
  debug(...args: any[]): void;
}

declare interface ConsoleBotWorker extends BotKitWorker<BotKitMessage> {
}

declare interface ConsoleBot extends CoreBot<BotKitMessage, ConsoleBotWorker> {
}

// type FacebookEvent = 'message_received' | 'facebook_postback' | 'facebook_optin' | 'message_delivered' | 'message_read' | 'facebook_referral';

declare interface FacebookBotKitMessage extends BotKitMessage {
  page?: string;
  timestamp?: string;
  seq?: string;
  is_echo?: any;
  mid?: string;
  sticker_id?: any;
  quick_reply?: any;
  quick_replies? : any;
  sender_action?: any;
  notification_type?: any;
  payload?: any;
  referral?: any;
  read?: any;
  account_linking?: any;
  delivery?: any;
  // access_token?: any;
  [prop: string]: any;
}

declare interface FacebookBotKitWorker extends BotKitWorker<FacebookBotKitMessage> {
  startTyping(src: any, cb?: (error: any, rawMessage: FacebookBotKitMessage) => void ): void;
  stopTyping(src: any, cb?: (error: any, rawMessage: FacebookBotKitMessage) => void ): void;
  replyWithTyping(src: any, resp: any, cb?: (error: any, rawMessage: FacebookBotKitMessage) => void ): void;
}

declare interface FacebookBot extends CoreBot<FacebookBotKitMessage, FacebookBotKitWorker> {
  webserver: any;
  createWebhookEndpoints(webserver: any, bot: FacebookBotKitWorker, cb?: ()=>void): FacebookBot;
  handleWebhookPayload(req: any, res: any, bot: FacebookBotKitWorker): void;
  setupWebserver(port: any, cb?: any): FacebookBot;
  api: {
    message_profile_api: {
      greeting(greeting: any): void;
      delete_greeting(): void;
      get_greeting(cb: (error: any, body: any) => void): void;
      get_started(payload: any): void;
      delete_get_started(): void;
      get_get_started(cb: (error: any, body: any) => void): void;
      menu(payload: any): void;
      delete_menu(): void;
      get_menu(cb: (error: any, body: any) => void): void;
      account_linking(payload: any): void;
      delete_account_linking(): void;
      get_account_linking(cb: (error: any, body: any) => void): void;
      domain_whitelist(payload: string|string[]): void;
      delete_domain_whitelist(): void;
      get_domain_whitelist(cb: (error: any, body: any) => void): void;
      target_audience(payload: any): void;
      delete_target_audience(): void;
      get_target_audience(cb: (error: any, body: any) => void): void;
      home_url(payload: any): void;
      delete_home_url(): void;
      get_home_url(cb: (error: any, body: any) => void): void;
      postAPI(message: any): void;
      deleteAPI(message: any): void;
      getAPI(fields: string, cb: (error: any, body: any) => void): void;
      get_messenger_code(image_size: number, cb: (error: any, body: any) => void, ref: any): void;
    }
  };
}

declare interface SlackBotKitMessage extends BotKitMessage {
  team?: string;
  events_api?: boolean;
  authid_users?: any;
  subtype?: string;
  bot_id?: string;
  event?: string;
  ok?: any;
  reply_to?: any;
  ts?: any;
  [prop: string]: any;
}

declare interface SlackBotKitWorker extends BotKitWorker<SlackBotKitMessage> {
  rtm: any;
  api: any;
  destroyed: boolean;
  pingTimeoutId: any;
  retryBackoff: any;
  retryEnabled: boolean;
  maxRetry: number;
  configureIncomingWebhook(options: {
    url: string;
    [propName: string]: any;
  }): SlackBotKitWorker;
  sendWebhook(options: any, cb: (error: any, body: any) => void): void;
  configureRTM(config: {
    token: string;
    [propName: string]: any;
  }): SlackBotKitWorker;
  closeRTM(error: any): void;
  destroy(): void;
  startRTM(cb?: (error: any, bot: SlackBotKitWorker, res: any) => void): SlackBotKitWorker;
  identifyBot(cb: (error: any, data: {
    name: any;
    id: any;
    team_id: any;
  }) => void): void;
  identifyTeam(cb: (error: any, team_id: any) => void): void;
  startPrivateConversation(message: SlackBotKitMessage, cb?: (response: any, convo: BotKitConversation<SlackBotKitMessage>) => void): void;
  startConversationInThread(message: SlackBotKitMessage, cb?: (response: any, convo: BotKitConversation<SlackBotKitMessage>) => void): void;
  createConversationInThread(message: SlackBotKitMessage, cb?: (response: any, convo: BotKitConversation<SlackBotKitMessage>) => void): void;
  _startDM(task: BotKitTask<SlackBotKitMessage>, user_id: any, cb: (error: any, convo: BotKitConversation<SlackBotKitMessage>) => void): void;
  replyAcknowledge(cb: (error: any) => void): void;
  replyPublic(src: any, resp: any, cb?: (error: any) => void): void;
  replyPublicDelayed(src: any, resp: any, cb?: (error: any) => void): void;
  replyPrivate(src: any, resp: any, cb?: (error: any) => void): void;
  replyPrivateDelayed(src: any, resp: any, cb?: (error: any) => void): void;
  replyInteractive(src: any, resp: any, cb?: (error: any) => void): void;
  replyInThread(src: any, resp: any, cb?: (error: any) => void): void;
  replyAndUpdate(src: any, resp: any, cb?: (error: any, rawMessage: SlackBotKitMessage) => void ): void;

  startTyping(src: any): void;
  replyWithTyping(src: any, resp: any, cb?: (error: any, rawMessage: SlackBotKitMessage) => void ): void;
}

declare interface SlackBot extends CoreBot<SlackBotKitMessage, SlackBotKitWorker> {
  webserver: any;
  configureSlackApp(configuration: any, cb?: () => void): SlackBot;
  createHomepageEndpoint(webserver: any): SlackBot;
  secureWebhookEndpoints(): void;
  createWebhookEndpoints(webserver: any, authenticationTokens?: any): SlackBot;
  findAppropriateTeam(payload: any, cb: (error: any, team: any) => void): void;
  handleWebhookPayload(req: any, res: any): void;
  handleInteractiveMessage(payload: any, bot: any): void;
  handleEventsAPI(payload: any, bot: any): void;
  handleSlashCommand(payload: any, bot: any): void;
  handleOutgoingWebhook(payload: any, bot: any): void;
  saveTeam(team: any, cb: (error: any, team_id: any) => void): void;
  findTeamById(team_id: any, cb: (error: any, team: any) => void): void;
  setupWebserver(port: any, cb?: (error: any, webserver: any) => void): SlackBot;
  getAuthorizeURL(team_id: any, redirect_params: any): string;
  createOauthEndpoints(webserver: any, cb?: (error: any, req: any, res: any) => void): SlackBot;
  handleSlackEvents(): void;
}

declare module 'botkit' {
  function core(configuration: any): CoreBot<BotKitMessage, BotKitWorker<BotKitMessage>>;
  function facebookbot(configuration: any): FacebookBot;
  function consolebot(configuration: any): ConsoleBot;
  function slackbot(configuration: any): SlackBot;
}