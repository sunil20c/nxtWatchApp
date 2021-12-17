import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {IoMdClose} from 'react-icons/io'
import Cookies from 'js-cookie'

import {BsSearch} from 'react-icons/bs'
import {HomeMainContainer, BannerContainer} from './styledComponents'
import Header from '../Header'

import VideoItem from '../VideoItem'

import './index.css'
import FilterSection from '../FilterSection'
import ContextChanges from '../../Context/ContextChanges'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class Home extends Component {
  state = {
    videosList: [],
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    bannerStatus: true,
  }

  componentDidMount() {
    this.getVideos()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchVideo = () => {
    const {searchInput} = this.state
    this.setState({searchInput}, this.getVideos)
  }

  onClickRetryNoVideosList = () => {
    this.getVideos()
  }

  onClickBannerClose = () => {
    this.setState({bannerStatus: false})
  }

  convertToRequired = channel => ({
    name: channel.name,
    profileImageUrl: channel.profile_image_url,
  })

  convertIntoLatest = video => ({
    id: video.id,
    title: video.title,
    thumbnailUrl: video.thumbnail_url,
    channel: this.convertToRequired(video.channel),
    viewCount: video.view_count,
    publishedAt: video.published_at,
  })

  getVideos = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/videos/all?search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const fetchedVideos = {
        total: data.total,
        videos: data.videos.map(eachItem => this.convertIntoLatest(eachItem)),
      }

      this.setState({
        apiStatus: apiStatusConstants.success,
        videosList: fetchedVideos.videos,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSearchInput = () => {
    const {searchInput} = this.state
    return (
      <div className="search-container">
        <input
          type="search"
          value={searchInput}
          placeholder="search"
          className="search-input"
          onChange={this.onChangeSearchInput}
        />
        <button
          type="button"
          data-testid="searchButton"
          className="search-button"
          onClick={this.onClickSearchVideo}
        >
          <BsSearch className="home-search-image" />
        </button>
      </div>
    )
  }

  renderHomeVideosSuccessView = () => {
    const {videosList} = this.state
    const videosCount = videosList.length > 0
    return videosCount ? (
      <ul className="videos-list-container">
        {videosList.map(eachVideo => (
          <VideoItem key={eachVideo.id} videoDetails={eachVideo} />
        ))}
      </ul>
    ) : (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png"
          alt="no videos"
        />
        <h1>No Search results found</h1>
        <p>Try different key words or remove search filter</p>
        <button type="button" onClick={this.onClickRetryNoVideosList}>
          Retry
        </button>
      </div>
    )
  }

  renderHomeFailureView = () => (
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
            <button type="button" onClick={this.onClickRetryNoVideosList}>
              Retry
            </button>
          </div>
        )
      }}
    </ContextChanges.Consumer>
  )

  renderHomeLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFinalVideos = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderHomeVideosSuccessView()
      case apiStatusConstants.failure:
        return this.renderHomeFailureView()
      case apiStatusConstants.inProgress:
        return this.renderHomeLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <ContextChanges.Consumer>
        {value => {
          const {isDarkTheme} = value
          const {bannerStatus} = this.state

          const homeBgColor = isDarkTheme ? '#181818' : '#ffffff'
          const textColor = isDarkTheme ? '#ffffff' : '#475569'
          return (
            <HomeMainContainer
              data-testid="home"
              bgColor={homeBgColor}
              color={textColor}
            >
              <Header />

              <div className="left-right-home-container">
                <FilterSection className="left-side-container" />
                <div className="right-side-main-container">
                  {bannerStatus && (
                    <BannerContainer
                      data-testid="banner"
                      className="home-banner-section"
                    >
                      <button
                        type="button"
                        data-testid="close"
                        className="banner-close"
                        onClick={this.onClickBannerClose}
                      >
                        <IoMdClose className="home-close-icon" />
                      </button>
                      <img
                        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
                        alt="nxt watch logo"
                        className="logo-image-home"
                      />
                      <p className="banner-content">
                        Buy Nxt Watch Premium to prepaid plans with UPI
                      </p>
                      <button type="button" className="banner-button">
                        GET IT NOW
                      </button>
                    </BannerContainer>
                  )}
                  {this.renderSearchInput()}
                  {this.renderFinalVideos()}
                </div>
              </div>
            </HomeMainContainer>
          )
        }}
      </ContextChanges.Consumer>
    )
  }
}

export default Home
