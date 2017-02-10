import { Inject, Module } from 'hapiour'
import { Todos } from '../todos/todos.server'

@Module({
  basePath: '/api'
})
@Inject([Todos])
export class Api {

}
