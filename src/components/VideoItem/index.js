import {formatDistanceToNow} from 'date-fns'
import ContextChanges from '../../Context/ContextChanges'
import {LinkItem, LinkDetailsContainer} from './styledComponents'

import './index.css'

const VideoItem = props => (
  <ContextChanges.Consumer>
    {value => {
      const {isDarkTheme} = value

      const textColor = isDarkTheme ? '#f9f9f9' : '#475569'

      const {videoDetails} = props
      const {
        thumbnailUrl,
        id,
        title,
        viewCount,
        publishedAt,
        channel,
      } = videoDetails
      const {name, profileImageUrl} = channel

      const timePeriod = formatDistanceToNow(new Date(publishedAt))
      return (
        <li className="video-item-container">
          <LinkItem
            to={`/videos/${id}`}
            className="video-link-item-container"
            color={textColor}
          >
            <img
              src={thumbnailUrl}
              alt="video thumbnail"
              className="thumbnail-image"
            />
            <LinkDetailsContainer className="video-details-section">
              <div className="profile-title-container">
                <img
                  src={profileImageUrl}
                  alt="channel logo"
                  className="profile-image"
                />
                <p className="video-title">{title}</p>
              </div>
              <p className="video-item-name">{name}</p>
              <div className="views-date-container">
                <p className="video-view-count">{viewCount} views</p>
                <p> - </p>
                <p className="video-published-at">{timePeriod}</p>
              </div>
            </LinkDetailsContainer>
          </LinkItem>
        </li>
      )
    }}
  </ContextChanges.Consumer>
)
export default VideoItem
