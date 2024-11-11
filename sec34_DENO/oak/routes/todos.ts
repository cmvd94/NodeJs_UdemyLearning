import { Router } from "https://deno.land/x/oak@v12.6.0/mod.ts"

const router = new Router();

interface Todo {
    id: string,
    text: string
}

let todos: Todo[] = [];

router.get('/todos', (ctx, next) => {
    console.log('insde get all todos');
    ctx.response.body = { todos: todos }
})

router.post('/todos', async (ctx, next) => {
    console.log('inside creating todos');
    const result =  ctx.request.body();
    const data = await result.value
    const newTodo: Todo  = {
        id: new Date().toISOString(),
        text: data.text
    }
    todos.push(newTodo)
    ctx.response.body = { messgae: 'created',todos: todos };

/* //also works
    if (result.type === "json") {
        const data = await result.value; // Parse JSON body

        if (typeof data.text === "string") {
            const newTodo: Todo = {
                id: new Date().toISOString(),
                text: data.text,
            };

            todos.push(newTodo);
            ctx.response.body = { message: 'created', todos: todos };
        } else {
            ctx.response.status = 400;
            ctx.response.body = { message: "Invalid data format" };
        }
    } else {
        ctx.response.status = 400;
        ctx.response.body = { message: "Expected JSON body" };
    }

 */    
})

router.put('/todos/:todoId', async (ctx, next) => {
    console.log('inside update todos');
    const tid =  ctx.params.todoId;
    const result =  ctx.request.body();
    const data = await result.value
    const todoIndex = todos.findIndex( todo => {return todo.id === tid})
    todos[todoIndex] = { id: todos[todoIndex].id, text: data.text }
    ctx.response.body = { message: 'updated', todos: todos};  
})

router.delete('/todos/:todoId', (ctx, next) => {
    console.log('inside delete todos');
    const tid =  ctx.params.todoId;
    todos = todos.filter( todo => {
        return todo.id !== tid
    })
    ctx.response.body = { message: 'deleted', todos: todos}; 
})

export default router;
