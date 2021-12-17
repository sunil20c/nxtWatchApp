import {FaFirefoxBrowser} from 'react-icons/fa'
import {SavedContainer} from './styledComponents'
import Header from '../Header'
import VideoItem from '../VideoItem'
import FilterSection from '../FilterSection'
import ContextChanges from '../../Context/ContextChanges'

import './index.css'

const SavedVideos = () => (
  <ContextChanges.Consumer>
    {value => {
      const {savedVideos, isDarkTheme} = value
      const savedBgColor = isDarkTheme ? '#0f0f0f' : '#ffffff'
      const savedVideosList = savedVideos.length > 0
      return (
        <SavedContainer data-testid="savedVideos" bgColor={savedBgColor}>
          <Header />
          <div className="saved-videos-main-container">
            <FilterSection />
            {savedVideosList ? (
              <div>
                <h1 className="saved-heading">
                  <FaFirefoxBrowser className="icon" /> Saved Videos
                </h1>
                <ul className="saved-videos-container">
                  {savedVideos.map(eachVideo => (
                    <VideoItem key={eachVideo.id} videoDetails={eachVideo} />
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-saved-videos-img.png"
                  alt="no saved videos"
                  className="no-saved-view-image"
                />
                <h1>No saved videos found</h1>
                <p>Save your videos by clicking a button</p>
              </div>
            )}
          </div>
        </SavedContainer>
      )
    }}
  </ContextChanges.Consumer>
)

export default SavedVideos
