import { Application } from '../declarations';
import users from './users/users.service';
import wallets from './wallets/wallets.service';
import addCurrency from './add-currency/add-currency.service';
import clubs from './clubs/clubs.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(wallets);
  app.configure(addCurrency);
  app.configure(clubs);
}
