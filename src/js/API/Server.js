import http from 'http';
import Koa from 'koa';
import koaBody from 'koa-body';
import cors from 'koa2-cors';
import Router from 'koa-router';
import Tickets from './Tickets';

const app = new Koa();
const tickets = new Tickets();
const router = new Router();

app.use(cors());
app.use(koaBody({
  urlencoded: true,
  text: true,
  json: true,
}));

router.get('/allTickets', async (ctx, next) => {
  ctx.response.body = tickets.storage.map((item) => ({
    id: item.id,
    status: item.status,
    name: item.name,
    created: item.created,
  }));
});

router.get('/ticketById', async (ctx, next) => {
  const ticketId = Number(ctx.request.query.id);
  ctx.response.body = tickets.getTicketById(ticketId);
});

router.delete('/deleteTicketById', async (ctx, next) => {
  const ticketId = Number(ctx.request.query.id);
  ctx.response.body = tickets.deleteTicket(ticketId);
});

router.post('/createTicket', async (ctx, next) => {
  const { name, description } = ctx.request.query;
  ctx.response.body = tickets.createTicket(name, description);
});

router.post('/changeTicketStatus', async (ctx, next) => {
  const ticketId = Number(ctx.request.query.id);
  ctx.response.body = tickets.changeTicketStatus(ticketId);
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 8080;
const server = http.createServer(app.callback());
server.listen(port, () => console.log('server started'));
