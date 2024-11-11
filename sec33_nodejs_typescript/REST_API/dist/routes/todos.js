"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//const todos : Array<Todo> = []
let todos = [];
const router = (0, express_1.Router)();
router.get('/', (req, res, next) => {
    res.status(200).json({ todos: todos });
});
router.post('/todo', (req, res, next) => {
    const body = req.body;
    //const body = req.body as { text: string}
    const newTodo = {
        id: new Date().toISOString(),
        text: body.text
    };
    todos.push(newTodo);
    res.status(201).json({ message: 'new Todo added', todos: todos });
});
router.put('/todo/:todoId', (req, res, next) => {
    const body = req.body;
    const params = req.params;
    const tid = params.todoId;
    console.log(tid);
    const todoIndex = todos.findIndex(todoItem => todoItem.id.toString() === tid.toString());
    console.log(todoIndex);
    if (todoIndex >= 0) {
        todos[todoIndex] = {
            id: todos[todoIndex].id,
            text: body.text
        };
        return res.status(200).json({ message: 'updated', todos: todos });
    }
    res.status(404).json({ message: 'could not find id' });
});
router.delete('/todo/:todoId', (req, res, next) => {
    const params = req.params;
    const tid = params.todoId;
    todos = todos.filter(todoItem => todoItem.id !== tid);
    res.status(200).json({ message: 'deleted', todos: todos });
});
exports.default = router;
