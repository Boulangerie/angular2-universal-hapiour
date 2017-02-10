import { Component } from '@angular/core'
import { TodoService } from './shared/todo.service'
import { Todo } from './shared/todo.model'

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent {

  public newTodo: Todo = new Todo()

  public constructor(private todoDataService: TodoService) {

  }

  public addTodo() {
    this.todoDataService.addTodo(this.newTodo)
    this.newTodo = new Todo()
  }

  public get todos() {
    return this.todoDataService.getAllTodos()
  }
}
