import * as _ from 'lodash'
import { Injectable } from '@angular/core'
import { Http } from '@angular/http'
import { environment } from '../../../environments/environment'
import { Todo } from './todo.model'
import 'rxjs/Rx'

@Injectable()
export class TodoService {

  public todos: Todo[] = []
  private endpoint: string

  public constructor(private http: Http) {
    this.endpoint = this.getEndpoint()
    this.loadTodos()
  }

  private getEndpoint(): string {
    if (environment.here.url) {
      return environment.here.url
    } else {
      const protocol: string = _.get(global, 'location.protocol', 'http:')
      const hostname: string = _.get(global, 'location.hostname', 'localhost')
      return `${protocol}//${hostname}${environment.here.port ? `:${environment.here.port}` : ''}`
    }
  }

  public addTodo(todo: Todo): void {
    this.http
      .post(`${this.endpoint}/api/todos`, todo)
      .map(res => res.json())
      .subscribe((newTodo) => {
        this.todos.push(newTodo)
      })
  }

  public deleteTodo(todo: Todo): void {
    this.http
      .delete(`${this.endpoint}/api/todos/${todo.id}`)
      .map(res => res.json())
      .subscribe(() => {
        _.remove(this.todos, { id: todo.id })
      })
  }

  public updateTodo(todo: Todo): void {
    this.http
      .put(`${this.endpoint}/api/todos/${todo.id}`, todo)
      .map(res => res.json())
      .subscribe((updatedTodo) => {
        const existingTodo = _.find(this.todos, { id: todo.id })
        _.extend(existingTodo, updatedTodo)
      })
  }

  public getAllTodos(): Todo[] {
    return this.todos
  }

  public toggleTodoComplete(todo: Todo) {
    todo.complete = !todo.complete
    this.updateTodo(todo)
  }

  private loadTodos(): void {
    this.http
      .get(`${this.endpoint}/api/todos`)
      .map(res => res.json())
      .subscribe((todos) => {
        this.todos = _.map(todos, (todo) => {
          return new Todo(todo)
        })
      })
  }

}
