import * as React from 'react'
import { render } from 'react-dom'

function App () {
  return (
    <div>
      hello world
    </div>
  )
}

const rootEl = document.querySelector('#root')

render(<App />, rootEl)
