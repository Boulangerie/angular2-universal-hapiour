import * as _ from 'lodash'

export class Todo {

  public id: number
  public title: string = ''
  public complete: boolean = false

  public constructor(values: Object = {}) {
    _.extend(this, values)
  }
}
