import app from "./app";
import { PORT } from "./config/envs";
import { dbConnection } from "./database/config";

async function main() {
  await dbConnection();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}

main();
