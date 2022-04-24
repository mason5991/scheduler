import app from './app';
import arena from './arena';
import database from './database';
import { printInfo } from './utils/log';

const port = process.env.PORT || 3000;

const load = async () => {
  const dbConnection = await database.connect();
  if (dbConnection) {
    app.listen(port, () => {
      printInfo(
        `Worker ${process.pid} started, listening on http://localhost:${port}`,
      );
      // Start arena http://localhost:4567/arena
      arena();
    });
  }
};

export default load;
