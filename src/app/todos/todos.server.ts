import * as _ from 'lodash'
import * as Joi from 'joi'
import { Request, IReply } from 'hapi'
import { Route, Module } from 'hapiour'
import { Todo } from './shared/todo.model'

@Module({
  basePath: '/todos'
})
export class Todos {

  private todos: Todo[] = [{
    id: 1,
    title: 'Todo #1',
    complete: true
  }, {
    id: 2,
    title: 'Todo #2',
    complete: false
  }, {
    id: 3,
    title: 'Todo #3',
    complete: false
  }]

  @Route({
    method: 'GET',
    path: ''
  })
  public getAll(request: Request, reply: IReply): void {
    reply(this.todos)
  }

  @Route({
    method: 'GET',
    path: '/{id}'
  })
  public getOne(request: IReadRequest, reply: IReply): void {
    const id: number = _.parseInt(request.params.id)
    const todo: Todo = _.find(this.todos, { id: id })
    if (_.isUndefined(todo)) {
      this.notFound(reply)
    } else {
      reply(todo)
    }
  }

  @Route({
    method: 'POST',
    path: '',
    config: {
      validate: {
        payload: {
          title: Joi.string().required(),
          complete: Joi.boolean().optional()
        }
      }
    }
  })
  public create(request: ICreateRequest, reply: IReply): void {
    const lastId = <number> _(this.todos)
      .map('id')
      .max()
    const todo: Todo = new Todo(_.defaults({ id: lastId + 1 }, request.payload))
    this.todos.push(todo)
    reply(todo)
  }

  @Route({
    method: 'PUT',
    path: '/{id}',
    config: {
      validate: {
        payload: {
          id: Joi.number().optional(),
          title: Joi.string().required(),
          complete: Joi.boolean().optional()
        }
      }
    }
  })
  public update(request: IUpdateRequest, reply: IReply): void {
    const id: number = _.parseInt(request.params.id)
    const todo: Todo = _.find(this.todos, { id: id })
    if (_.isUndefined(todo)) {
      this.notFound(reply)
    } else {
      todo.title = request.payload.title
      todo.complete = Boolean(request.payload.complete)
      reply(todo)
    }
  }

  @Route({
    method: 'DELETE',
    path: '/{id}'
  })
  public delete(request: IDeleteRequest, reply: IReply): void {
    const id: number = _.parseInt(request.params.id)
    const todo: Todo = _.find(this.todos, { id: id })
    if (_.isUndefined(todo)) {
      this.notFound(reply)
    } else {
      _.remove(this.todos, { id: id })
      reply(todo)
    }
  }

  private notFound(reply: IReply): void {
    const response = {
      status: 404,
      message: 'Not Found'
    }
    const json = JSON.stringify(response, null, 2)
    reply(json)
      .header('Content-Type', 'application/json')
      .code(404)
  }
}

interface ICreateRequest extends Request {
  payload: {
    title: string
    complete?: boolean
  }
}

interface IReadRequest extends Request {
  params: {
    id: string
  }
}

interface IUpdateRequest extends Request {
  params: {
    id: string
  }
  payload: {
    title: string
    complete?: boolean
  }
}

interface IDeleteRequest extends Request {
  params: {
    id: string
  }
}
