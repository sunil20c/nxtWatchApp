import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {FaFirefoxBrowser} from 'react-icons/fa'
import {TrendingContainer} from './styledComponents'
import ContextChanges from '../../Context/ContextChanges'
import Header from '../Header'
import FilterSection from '../FilterSection'
import VideoItem from '../VideoItem'

import './index.css'

const apiTrendingStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class Trending extends Component {
  state = {
    trendingVideos: [],
    apiTrendingStatus: apiTrendingStatusConstants.initial,
  }

  componentDidMount() {
    this.getTrending()
  }

  onClickTrendingVideoFailureRetry = () => {
    this.getTrending()
  }

  conversionTypeTrending = trending => ({
    id: trending.id,
    thumbnailUrl: trending.thumbnail_url,
    title: trending.title,
    channel: {
      name: trending.channel.name,
      profileImageUrl: trending.channel.profile_image_url,
    },
    viewCount: trending.view_count,
    publishedAt: trending.published_at,
  })

  getTrending = async () => {
    this.setState({apiTrendingStatus: apiTrendingStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/videos/trending'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const fetchedTrending = data.videos.map(eachTrending =>
        this.conversionTypeTrending(eachTrending),
      )
      this.setState({
        trendingVideos: fetchedTrending,
        apiTrendingStatus: apiTrendingStatusConstants.success,
      })
    } else {
      this.setState({apiTrendingStatus: apiTrendingStatusConstants.failure})
    }
  }

  renderTrendingSuccessView = () => {
    const {trendingVideos} = this.state

    return (
      <div>
        <ul className="trending-items-list-container">
          {trendingVideos.map(eachTrend => (
            <VideoItem key={eachTrend.id} videoDetails={eachTrend} />
          ))}
        </ul>
      </div>
    )
  }

  renderTrendingFailureView = () => (
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
            <button
              type="button"
              onClick={this.onClickTrendingVideoFailureRetry}
            >
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

  renderTrending = () => {
    const {apiTrendingStatus} = this.state
    switch (apiTrendingStatus) {
      case apiTrendingStatusConstants.success:
        return this.renderTrendingSuccessView()
      case apiTrendingStatusConstants.failure:
        return this.renderTrendingFailureView()
      case apiTrendingStatusConstants.inProgress:
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

          const trendingBgColor = isDarkTheme ? '#0f0f0f' : '#ffffff'

          return (
            <TrendingContainer data-testid="trending" bgColor={trendingBgColor}>
              <Header />
              <div className="left-right-container">
                <FilterSection />
                <div>
                  <h1 className="saved-heading">
                    <FaFirefoxBrowser className="icon" /> Trending
                  </h1>
                  {this.renderTrending()}
                </div>
              </div>
            </TrendingContainer>
          )
        }}
      </ContextChanges.Consumer>
    )
  }
}

export default Trending
