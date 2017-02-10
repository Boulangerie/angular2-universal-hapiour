import { NgModule, ModuleWithProviders } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { TodosComponent } from './todos.component'
import { TodoListComponent } from './todo-list/todo-list.component'
import { TodoComponent } from './todo/todo.component'
import { TodoService } from './shared/todo.service'
import { CommonModule } from '@angular/common'

const MODULES = [
  FormsModule,
  CommonModule
]

const PIPES = [

]

const COMPONENTS = [
  TodosComponent,
  TodoListComponent,
  TodoComponent
]

const PROVIDERS = [
  TodoService
]

@NgModule({
  imports: [...MODULES],
  declarations: [...PIPES, ...COMPONENTS],
  exports: [...MODULES, ...PIPES, ...COMPONENTS],
  providers: [...PROVIDERS]
})
export class TodosModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: TodosModule,
      providers: [...PROVIDERS]
    }
  }
}
