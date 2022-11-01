import React from 'react'
import axios from 'axios'
import Form from './Form'
import TodoList from './TodoList'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error: '',
    todoNameInput: '',
    displayCompleteds: true,
  }

  onTodoNameInputChange = e => {
    const { value } = e.target
    this.setState({ ...this.state, todoNameInput: value })

  }

  resetForm = () => {
    this.setState({ ...this.state, todoNameInput: '' })
  }

  setAxiosResponseError = err => {
    this.setState({ ...this.state, error: err.response.data.message })
  }

  postNewTodo = () => {
    axios.post(URL, { name: this.state.todoNameInput })
      .then(res => {
        this.setState({ ...this.state, todos: this.state.todos.concat(res.data.data) })
        this.resetForm()
      })
      .catch(this.setAxiosResponseError)
  }

  onTodoFormSubmit = e => {
    e.preventDefault()
    this.postNewTodo()
  }

  fetchAllTodos = () => {
    axios.get(URL)
      .then(res => {
        this.setState({ ...this.state, todos: res.data.data })
      })
      .catch(this.setAxiosResponseError)
  }

  toggleCompleted = id => () => {
    axios.patch(`${URL}/${id}`)
      .then(res => {
        this.setState({
          ...this.state, todos: this.state.todos.map(td => {
            if (td.id !== id) return td
            return res.data.data
          })
        })

      })
      .catch(this.setAxiosResponseError)
  }

  toggleDisplayCompleteds = () => {
    this.setState({ ...this.state, displayCompleteds: !this.state.displayCompleteds })
  }

  componentDidMount() {
    this.fetchAllTodos()

  }

  render() {
    return (
      <div>
        <div id='error'>Error: {this.state.error}</div>
          <TodoList
            todos={this.state.todos}
            displayCompleteds={this.state.displayCompleteds}
            toggleCompleted={this.toggleCompleted}

          />
          <Form
            onTodoFormSubmit={this.onTodoFormSubmit}
            onTodoNameInputChange={this.onTodoNameInputChange}
            todoNameInput={this.state.todoNameInput}
            toggleDisplayCompleteds={this.state.toggleDisplayCompleteds}
            displayCompleteds={this.state.displayCompleteds}
          />
      </div>
    )
  }
}
