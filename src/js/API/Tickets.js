module.exports = class Tickets {
  constructor() {
    this.storage = [
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
    return this.storage;
  }

  createTicket(object) {
    try {
      const sorted = this.storage.sort((ticket) => ticket.id);
      const id = sorted[sorted.length - 1].id + 1;
      const status = false;
      const now = new Date();
      const day = (now.getDate() < 10) ? `0${now.getDate()}` : now.getDate();
      const month = ((now.getMonth() + 1) < 10) ? `0${now.getMonth() + 1}` : now.getMonth() + 1;
      const hour = (now.getHours() < 10) ? `0${now.getHours()}` : now.getHours();
      const minutes = (now.getMinutes() < 10) ? `0${now.getMinutes()}` : now.getMinutes();
      const year = now.getFullYear().toString().slice(2);
      const fullDate = `${day}.${month}.${year} ${hour}:${minutes}`;
      this.storage.push({
        id,
        status,
        name: object.name,
        description: object.description,
        fullDate,
      });
      return this.getTicketById(id);
    } catch (error) {
      return new Error('Невозможно создать тикет');
    }
  }

  getTicketById(id) {
    return this.storage.find((task) => task.id === id);
  }

  changeTicketStatus(id) {
    const ticket = this.getTicketById(id);
    ticket.status = ticket.status === true ? ticket.status = false : ticket.status = true;
  }

  deleteTicket(id) {
    this.storage.forEach((ticket, index) => {
      if (ticket.id === id) this.storage.splice(index, 1);
    });
  }

  editTicket(object) {
    const ticket = this.storage.find((el) => el.id === id);
    if (ticket) {
      ticket.name = object.name;
      ticket.description = object.description;
      return 'тикет изменён';
    }
    return 'тикет не найден';
  }
}
