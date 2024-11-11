import { Application } from "https://deno.land/x/oak@v12.6.0/mod.ts"
import  todosRoutes  from "./routes/todos.ts"


const app = new Application();

app.use( async(ctx, next) => {
    console.log('middleware');
    await next()
  })
/*
app.use( (ctx, next) => {
    console.log('middleware');
    next()
  })
*/

//now its an obj 
app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());
// app.use((ctx) => {
//   ctx.response.body = "Hello World!";
// });

await app.listen({ port: 3000 });