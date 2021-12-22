import { createServer } from 'http';
import Koa from 'koa';
import koaBody from 'koa-body';
import cors from 'koa2-cors';

const app = new Koa();

class Tickets {
  constructor() {
    this.tickets = [
      {
        id: 0,
        name: 'Поменять краску в принтереб ком. 404',
        description: 'Принтер HP LJ 1210, картриджи на складе',
        status: true,
        created: '10.03.19 08:40',
      },
      {
        id: 1,
        name: 'Переустановить Windows, ПК-Hall24',
        description: 'Диск с лицензией Windows 11 в офисе, на верхней полке',
        status: false,
        created: '15.03.19 12:35',
      },
      {
        id: 2,
        name: 'Установить обновление КВ-XXX',
        description: 'Перезагрузить компьютер',
        status: false,
        created: '15.03.19 12:40',
      },
    ];
  }

  allTickets() {
    return this.tickets;
  }

  createTicket(object) {
      const sorted = this.tickets.sort((ticket) => ticket.id);
      const id = sorted[sorted.length - 1].id + 1;
      const status = false;
      const now = new Date();
      const day = (now.getDate() < 10) ? `0${now.getDate()}` : now.getDate();
      const month = ((now.getMonth() + 1) < 10) ? `0${now.getMonth() + 1}` : now.getMonth() + 1;
      const hour = (now.getHours() < 10) ? `0${now.getHours()}` : now.getHours();
      const minutes = (now.getMinutes() < 10) ? `0${now.getMinutes()}` : now.getMinutes();
      const year = now.getFullYear().toString().slice(2);
      const fullDate = `${day}.${month}.${year} ${hour}:${minutes}`;
      this.tickets.push({
        id: id,
        status: status,
        name: object.name,
        description: object.description,
        created: fullDate,
      });
  }

  getTicketById(id) {
    return this.tickets.find((task) => task.id === id);
  }

  changeTicketStatus(id) {
    const ticket = this.getTicketById(id);
    ticket.status = ticket.status === true ? ticket.status = false : ticket.status = true;
  }

  deleteTicket(id) {
    this.tickets.forEach((ticket, index) => {
      if (ticket.id === id) this.tickets.splice(index, 1);
    });
  }

  editTicket(object) {
    const ticket = this.getTicketById(object.id);
    if (ticket) {
      ticket.name = object.name;
      ticket.description = object.description;
      return 'тикет изменён';
    }
    return 'тикет не найден';
  }
}

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
    ctx.response.body = `Unknown method '${method}' un request parameteres`;
}
});

const port = process.env.PORT || 8080;
const server = createServer(app.callback());
server.listen(port, () => console.log('server started'));

