import React from 'react'
import './App.css'
import store from './store'
import { Provider } from 'react-redux'
import PageListing from './PageListing'
import Notes from './Notes'
import AddPage from './AddPage'

export function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <section className="App-header">
          <div id="Sidebar">
            <nav>
              <AddPage />
              <PageListing />
            </nav>
          </div>
          <div>
            <Notes />
          </div>
        </section>
      </div>
    </Provider>
  )
}

export default App;