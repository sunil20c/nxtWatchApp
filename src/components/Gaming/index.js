import {Component} from 'react'
import {SiYoutubegaming} from 'react-icons/si'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import ContextChanges from '../../Context/ContextChanges'
import Header from '../Header'
import FilterSection from '../FilterSection'

import {GamingContainer} from './styledComponents'

import './index.css'

const apiGamingStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Gaming extends Component {
  state = {gameVideos: [], apiGamingStatus: apiGamingStatusConstants.initial}

  componentDidMount() {
    this.getGaming()
  }

  onClickGameVideoFailureRetry = () => {
    this.getGaming()
  }

  conversionTypeGaming = trending => ({
    id: trending.id,
    thumbnailUrl: trending.thumbnail_url,
    title: trending.title,

    viewCount: trending.view_count,
  })

  renderGameDetailsView = game => {
    const {id, title, thumbnailUrl, viewCount} = game
    return (
      <li>
        <Link to={`/videos/${id}`} className="game-item-container">
          <img
            src={thumbnailUrl}
            alt="video thumbnail"
            className="game-thumbnail"
          />
          <p className="gaming-title">{title}</p>
          <p className="gaming-views">{viewCount}</p>
        </Link>
      </li>
    )
  }

  getGaming = async () => {
    this.setState({apiGamingStatus: apiGamingStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/videos/gaming'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const gameFetched = data.videos.map(eachGame =>
        this.conversionTypeGaming(eachGame),
      )
      this.setState({
        gameVideos: gameFetched,
        apiGamingStatus: apiGamingStatusConstants.success,
      })
    } else {
      this.setState({apiGamingStatus: apiGamingStatusConstants.failure})
    }
  }

  renderGamingSuccessView = () => {
    const {gameVideos} = this.state

    return (
      <div>
        <ul className="game-lists-container">
          {gameVideos.map(game => this.renderGameDetailsView(game))}
        </ul>
      </div>
    )
  }

  renderGamingFailureView = () => (
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
            <p>We are having some trouble.</p>
            <button type="button" onClick={this.onClickGameVideoFailureRetry}>
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

  renderGameVideos = () => {
    const {apiGamingStatus} = this.state
    switch (apiGamingStatus) {
      case apiGamingStatusConstants.success:
        return this.renderGamingSuccessView()
      case apiGamingStatusConstants.failure:
        return this.renderGamingFailureView()
      case apiGamingStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <ContextChanges.Consumer>
        {value => {
          const {isDarkTheme} = value

          const GamingBgColor = isDarkTheme ? '#0f0f0f' : '#ffffff'
          const gamingColor = isDarkTheme ? '#cccccc' : ' #606060'
          return (
            <GamingContainer
              data-testid="gamingVideos"
              bgColor={GamingBgColor}
              className="gaming-main-bg-container"
              color={gamingColor}
            >
              <Header />
              <div className="left-right-game-container">
                <FilterSection />
                <div className="game-heading-container">
                  <h1 className="game-heading">
                    <SiYoutubegaming className="icon" />
                    Gaming
                  </h1>
                  {this.renderGameVideos()}
                </div>
              </div>
            </GamingContainer>
          )
        }}
      </ContextChanges.Consumer>
    )
  }
}

export default Gaming
