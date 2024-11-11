import { Router } from "express";

import { Todo } from "../model/todosModel";

type RequestBody = { text: string}
type RequestParamas = { todoId: string}

//const todos : Array<Todo> = []
let todos : Todo[] = []
const router = Router();

router.get('/', (req, res, next) => {
    res.status(200).json( { todos: todos})
})

router.post('/todo', (req, res, next) => {
    const body = req.body as RequestBody
    //const body = req.body as { text: string}
    const newTodo : Todo= {
        id: new Date().toISOString(),
        text: body.text
    }
    todos.push(newTodo);
    res.status(201).json( {message: 'new Todo added',todos: todos})
})

router.put('/todo/:todoId',(req, res, next) => {
    const body = req.body as RequestBody
    const params = req.params as RequestParamas
    const tid = params.todoId;
    console.log(tid)
    
    const todoIndex = todos.findIndex(todoItem => todoItem.id.toString() === tid.toString());
    console.log(todoIndex)
    if( todoIndex >= 0){
        todos[todoIndex] = {
            id: todos[todoIndex].id,
            text: body.text
        }
        
        return  res.status(200).json( {message: 'updated',todos: todos})
    }
    res.status(404).json( {message: 'could not find id'})
})

router.delete('/todo/:todoId', (req, res, next) => {
    const params = req.params as RequestParamas
    const tid = params.todoId;
    todos = todos.filter( todoItem => todoItem.id !== tid)
    res.status(200).json( {message: 'deleted',todos: todos})
})

export default router;