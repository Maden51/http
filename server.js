const http = require('http');
const Koa  = require('koa');
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const Router = require('koa-router');
const Tickets = require('./src/js/API/Tickets');

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
  ctx.response.status = 204;
});

router.post('/createTicket', async (ctx, next) => {
  const { name, description } = ctx.request.query;
  ctx.response.body = tickets.createTicket(name, description);
  ctx.response.status = 204;
});

router.post('/changeTicketStatus', async (ctx, next) => {
  const ticketId = Number(ctx.request.query.id);
  ctx.response.body = tickets.changeTicketStatus(ticketId);
  ctx.response.status = 204;
});

router.post('/editTicket', async (ctx, next) => {
  const { name, description } = ctx.request.query;
  ctx.response.boyd = tickets.editTicket(name, description);
  ctx.response.status = 204; 
})

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 8080;
const server = http.createServer(app.callback());
server.listen(port, () => console.log('server started'));
