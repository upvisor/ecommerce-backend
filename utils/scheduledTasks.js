class ScheduledTasks {
  constructor() {
    if (!ScheduledTasks.instance) {
      this.tasks = new Map()
      ScheduledTasks.instance = this
    }
    return ScheduledTasks.instance
  }

  getTasks() {
    return this.tasks
  }

  setTask(productId, task) {
    const id = productId.toString()
    this.tasks.set(id, task)
  }

  hasTask(productId) {
    const id = productId.toString()
    return this.tasks.has(id)
  }

  getTask(productId) {
    const id = productId.toString()
    return this.tasks.get(id)
  }

  deleteTask(productId) {
    const id = productId.toString()
    this.tasks.delete(id)
  }
}

const instance = new ScheduledTasks()
Object.freeze(instance)

export default instance