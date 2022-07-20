// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const wallets = sequelizeClient.define('wallets', {
    hard_currency: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    soft_currency: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    },
    timestamps: true
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (wallets as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    wallets.belongsTo(models.users);
  };

  return wallets;
}
