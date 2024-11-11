import { Application } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

import todosRoutes from "./routes/todos.ts";
import { connect } from "./helpers/db_client.ts";

const app = new Application();

connect();//db connection

app.use(async (ctx, next) => {
  console.log("Middleware!");
  await next();
});
//cors initailization
app.use(oakCors()); //or below method
// app.use(async (ctx, next) => {
  //   ctx.response.headers.set('Access-Control-Allow-Origin','*');
  //   ctx.response.headers.set('Access-Control-Allow-Methods','*');
  //   ctx.response.headers.set('Access-Control-Allow-Headers','*Content-Type');
  
  //   await next();
  // });
  
app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

await app.listen({ port: 8000 });
