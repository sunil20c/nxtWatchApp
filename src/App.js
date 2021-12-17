import {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import VideoItemDetails from './components/VideoItemDetails'
import ContextChanges from './Context/ContextChanges'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute'
import Trending from './components/Trending'
import Gaming from './components/Gaming'
import SavedVideos from './components/SavedVideos'
import NotFound from './components/NotFound'

// Replace your code here
class App extends Component {
  state = {savedVideos: [], isDarkTheme: false}

  toggleTheme = () => {
    this.setState(prevState => ({isDarkTheme: !prevState.isDarkTheme}))
  }

  removeFromSavedVideos = video => {
    const {savedVideos} = this.state
    const updatedVideos = savedVideos.filter(
      eachVideoItem => eachVideoItem.id !== video.id,
    )
    this.setState({savedVideos: updatedVideos})
  }

  addToSavedVideos = video => {
    const {savedVideos} = this.state
    const selectedVideo = savedVideos.find(
      eachVideo => eachVideo.id === video.id,
    )
    if (selectedVideo) {
      this.removeFromSavedVideos(selectedVideo)
    } else {
      this.setState(prevState => ({
        savedVideos: [...prevState.savedVideos, video],
      }))
    }
  }

  render() {
    const {savedVideos, isDarkTheme} = this.state
    return (
      <ContextChanges.Provider
        value={{
          savedVideos,
          isDarkTheme,
          toggleTheme: this.toggleTheme,
          addToSavedVideos: this.addToSavedVideos,
          removeFromSavedVideos: this.removeFromSavedVideos,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute
            exact
            path="/videos/:id"
            component={VideoItemDetails}
          />
          <ProtectedRoute exact path="/trending" component={Trending} />
          <ProtectedRoute exact path="/gaming" component={Gaming} />
          <ProtectedRoute exact path="/saved-videos" component={SavedVideos} />
          <Route path="/NotFound" component={NotFound} />
          <Redirect to="/NotFound" />
        </Switch>
      </ContextChanges.Provider>
    )
  }
}
export default App
