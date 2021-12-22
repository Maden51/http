const http = require('http');
const Koa  = require('koa');
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const Tickets = require('./src/js/API/Tickets');

const app = new Koa();
const tickets = new Tickets();

app.use(koaBody({
  urlencoded: true,
  text: true,
  json: true,
  multipart: true,
}));

app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
);

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*' };
  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({...headers});
    try {
      return await next();
    } catch (e) {
      e.headers = {...e.headers, ...headers};
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Origin': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Allow-Origin')) {
      ctx.response.set('Access-Control-Allow-Origin', ctx.request.get('Access-Control-Allow-Origin'));
    }

    ctx.response.status = 204;
  }
});

app.use(async (ctx) => {
  let method;
  conlose.log(ctx.request.query);
  if (ctx.request.method === 'GET') ({ method, id } = ctx.request.query);
  else if (ctx.request.method === 'POST') ({ method, object } = ctx.request.body);
})

ctx.response.status = 200;
switch (method) {
  case 'allTickets': ctx.response.body = tickets.allTickets();
  break;
  case 'ticketById': ctx.response.body = tickets.getTicketById(id);
  break;
  case 'changeTicketStatus': ctx.response.body = tickets.changeTicketStatus(object.id);
  break;
  case 'createTicket': ctx.response.body = tickets.createTicket(object);
  break;
  case 'editTicket': ctx.response.body = tickets.editTicket(object);
  break;
  case 'deleteTicketById': ctx.response.body = tickets.deleteTicket(object.id);
  break;
  default:
    ctx.response.status = 400;
    ctx.response.body = `Unknown method '${method}' un request parameteres`
}

const port = process.env.PORT || 8080;
const server = http.createServer(app.callback());
server.listen(port, () => console.log('server started'));
