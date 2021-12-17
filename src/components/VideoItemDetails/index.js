import {Component} from 'react'

import {RiPlayListAddLine} from 'react-icons/ri'
import {AiOutlineDislike, AiOutlineLike} from 'react-icons/ai'

import Cookies from 'js-cookie'
import ReactPlayer from 'react-player'
import Loader from 'react-loader-spinner'
import {formatDistanceToNow} from 'date-fns'
import {LikeButton, VideoItemContainer} from './styledComponents'
import ContextChanges from '../../Context/ContextChanges'
import Header from '../Header'
import FilterSection from '../FilterSection'
import Trending from '../Trending'

import './index.css'

const apiVideoStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class VideoItemDetails extends Component {
  state = {
    videoDetails: {},
    apiVideoStatus: apiVideoStatusConstants.initial,
    videoSaveStatus: false,
    likeStatus: false,
  }

  componentDidMount() {
    this.getVideoItemDetails()
  }

  onClickLike = () => {
    this.setState({likeStatus: true})
  }

  onClickDisLike = () => {
    this.setState(prevState => ({likeStatus: !prevState.likeStatus}))
  }

  onClickVideoFailureRetry = () => {
    this.getVideoItemDetails()
  }

  convertedData = item => ({
    id: item.id,
    title: item.title,
    videoUrl: item.video_url,
    thumbnailUrl: item.thumbnail_url,
    channel: {
      name: item.channel.name,
      profileImageUrl: item.channel.profile_image_url,
      subscriberCount: item.channel.subscriber_count,
    },
    viewCount: item.view_count,
    publishedAt: item.published_at,
    description: item.description,
  })

  getVideoItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    this.setState({apiVideoStatus: apiVideoStatusConstants.inProgress})
    const Url = `https://apis.ccbp.in/videos/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(Url, options)
    if (response.ok === true) {
      const data = await response.json()
      const fetchedData = this.convertedData(data.video_details)
      this.setState({
        videoDetails: fetchedData,
        apiVideoStatus: apiVideoStatusConstants.success,
      })
    } else {
      this.setState({apiVideoStatus: apiVideoStatusConstants.failure})
    }
  }

  renderVideoItemSuccessView = () => (
    <ContextChanges.Consumer>
      {value => {
        const {addToSavedVideos} = value

        const {videoDetails, videoSaveStatus, likeStatus} = this.state
        const {
          title,
          thumbnailUrl,
          videoUrl,
          viewCount,
          publishedAt,
          description,
          channel,
        } = videoDetails
        const {name, profileImageUrl, subscriberCount} = channel
        const duration = formatDistanceToNow(new Date(publishedAt))
        const onClickSaveTo = () => {
          addToSavedVideos({...videoDetails})
          this.setState(prevState => ({
            videoSaveStatus: !prevState.videoSaveStatus,
          }))
        }

        const videoViewStatus = videoSaveStatus ? 'Saved' : 'save'
        const textColorOfLike = likeStatus ? '#2563eb' : '#64748b'
        const textColorOfDislike = likeStatus ? '#64748b' : '#2563eb'

        return (
          <div className="video-item-detail-section">
            <ReactPlayer url={videoUrl} className="video-player" />
            <p className="title">{title}</p>
            <div className="middle-line-container">
              <div className="views-published-container">
                <p className="view-count">{viewCount} views</p>
                <p className="gap"> - </p>
                <p className="duration">{duration}</p>
              </div>
              <div className="video-opinion-container">
                <LikeButton
                  type="button"
                  className="like-container"
                  color={textColorOfLike}
                  onClick={this.onClickLike}
                >
                  <AiOutlineLike />
                  <p>Like</p>
                </LikeButton>
                <LikeButton
                  type="button"
                  className="dislike-container"
                  onClick={this.onClickDisLike}
                  color={textColorOfDislike}
                >
                  <AiOutlineDislike />
                  <p>Dislike</p>
                </LikeButton>
                <button
                  type="button"
                  className="save-button"
                  onClick={onClickSaveTo}
                >
                  <RiPlayListAddLine />
                  {videoViewStatus}
                </button>
              </div>
            </div>
            <p>{thumbnailUrl}</p>
            <hr className="horizontal-line" />
            <div className="profile-details-container">
              <img
                src={profileImageUrl}
                alt="channel logo"
                className="profile-image"
              />
              <div className="name-subscriber-container">
                <p>{name}</p>
                <p>{subscriberCount} subscribers</p>
              </div>
            </div>
            <p>{description}</p>
          </div>
        )
      }}
    </ContextChanges.Consumer>
  )

  renderVideoTrendingView = () => (
    <div>
      <p>TrendingView</p>
      <Trending />
    </div>
  )

  renderVideoGamingView = () => (
    <div>
      <p>Gaming View</p>
    </div>
  )

  renderVideoItemFailureView = () => (
    <ContextChanges.Consumer>
      {value => {
        const {isDarkTheme} = value

        const failureImageUrl = isDarkTheme
          ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-dark-theme-img.png'
          : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png'

        return (
          <div>
            <img
              src={failureImageUrl}
              alt="failure view"
              className="failure-image"
            />
            <h1>Oops! Something went wrong!</h1>
            <p>
              We are having some trouble to complete your request. Please try
              again.
            </p>
            <button type="button" onClick={this.onClickVideoFailureRetry}>
              Retry
            </button>
          </div>
        )
      }}
    </ContextChanges.Consumer>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  videoItemDetails = () => {
    const {apiVideoStatus} = this.state
    switch (apiVideoStatus) {
      case apiVideoStatusConstants.success:
        return this.renderVideoItemSuccessView()
      case apiVideoStatusConstants.failure:
        return this.renderVideoItemFailureView()
      case apiVideoStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiVideoStatusConstants.trending:
        return this.renderVideoTrendingView()
      case apiVideoStatusConstants.gaming:
        return this.renderVideoGamingView()
      default:
        return null
    }
  }

  render() {
    return (
      <ContextChanges.Consumer>
        {value => {
          const {isDarkTheme} = value

          const videoItemBgColor = isDarkTheme ? '#0f0f0f' : '#ffffff'
          const videoItemTextColor = isDarkTheme ? '#f4f4f4' : '#424242'
          return (
            <VideoItemContainer
              data-testid="videoItemDetails"
              bgColor={videoItemBgColor}
              color={videoItemTextColor}
              className="video-item-details-main-container"
            >
              <Header />
              <div className="left-right-item-details-container">
                <div>
                  <FilterSection />
                </div>
                <div>{this.videoItemDetails()}</div>
              </div>
            </VideoItemContainer>
          )
        }}
      </ContextChanges.Consumer>
    )
  }
}

export default VideoItemDetails
