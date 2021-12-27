const http = require ('http');
const Koa =  require('koa');
const koaBody = require ('koa-body');
const cors = require('koa2-cors');

const app = new Koa();

class Tickets {
  constructor() {
    this.tickets = [];
  }

  getTickets() {
    return this.tickets;
  }

  createTicket(object) {
    const sorted = this.tickets.sort((ticket) => ticket.id);
    const id = sorted[sorted.length - 1].id + 1;
    this.tickets.push({
      id: id,
      name: object.name,
      description: object.description,
      status: false,
      created: new Date(),
    });
  }


  getTicketById(id) {
    const ticket = this.tickets.find((el) => el.id === id);
    if (ticket) {
      return ticket;
    } else {
      return 'тикет не найден';
    }
  }

  changeStatus(id) {
    const ticket = this.tickets.find((el) => el.id === id);
    if (ticket) {
      if (ticket.status === false) {
        ticket.status = true;
      } else {
        ticket.status = false;
      }
      return 'статус изменен';
    }
    return 'тикет не найден';
  }


  deleteTicket(id) {
    const ticketIndex = this.tickets.findIndex((el) => el.id === id);
    if (ticketIndex !== -1) {
      this.tickets.splice(ticketIndex, 1);
      return 'удалено';
    }
    return 'тикет не найден';
  }

  updateTicket(object) {
    const ticket = this.tickets.find((el) => el.id === id);
    if (ticket) {
      ticket.name = object.name;
      ticket.description = object.description;
      return 'тикет изменен';
    }
    return 'тикет не найден';
  }
}


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

const ticketsCtrl = new Tickets();
ticketsCtrl.tickets = [
  {
    id: 0,
    name: 'Поменять краску в принтереб ком. 404',
    description: 'Принтер HP LJ 1210, картриджи на складе',
    status: true,
    created: new Date(),
  },
  {
    id: 1,
    name: 'Переустановить Windows, ПК-Hall24',
    description: 'Диск с лицензией Windows 11 в офисе, на верхней полке',
    status: false,
    created: new Date(),
  },
  {
    id: 2,
    name: 'Установить обновление КВ-XXX',
    description: 'Перезагрузить компьютер',
    status: false,
    created: new Date(),
  },
];


app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*', };

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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});

app.use(async (ctx) => {
  let method;
  console.log(ctx.request.query);
  
  if (ctx.request.method === 'GET') ({ method, id } = ctx.request.query);
  else if (ctx.request.method === 'POST') ({ method, object } = ctx.request.body);
  

  ctx.response.status = 200;
  switch (method) {
    case 'allTickets': ctx.response.body = ticketsCtrl.getTickets();
      break;
    case 'ticketById': ctx.response.body = ticketsCtrl.getTicketById(id);
      break;
    case 'createTicket': ctx.response.body = ticketsCtrl.createTicket(object);
      break;
    case 'changeStatus': ctx.response.body = ticketsCtrl.changeStatus(object.id);
      break;
    case 'updateTicket': ctx.response.body = ticketsCtrl.updateTicket(object);
      break;
    case 'deleteTicket': ctx.response.body = ticketsCtrl.deleteTicket(object.id);
      break;
    default:
      ctx.response.status = 400;
      ctx.response.body = `Unknown method '${method}' in request parameters`;
  }
});

const port = process.env.PORT || 8080;
const server = http.createServer(app.callback());
server.listen(port, (error) => {
  if (error) {
    console.log('Error occured:', error);
    return;
  }
  console.log(`Server is listening on ${port} port`);
});