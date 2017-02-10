import { Component, Input } from '@angular/core'
import { TodoService } from '../shared/todo.service'

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {

  @Input() public todo

  public constructor(private todoDataService: TodoService) {

  }

  public toggleTodoComplete(todo) {
    this.todoDataService.toggleTodoComplete(todo)
  }

  public removeTodo(todo) {
    this.todoDataService.deleteTodo(todo)
  }

}
