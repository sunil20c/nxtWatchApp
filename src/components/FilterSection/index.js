import {RiPlayListAddLine} from 'react-icons/ri'
import {Link} from 'react-router-dom'

import {AiFillHome} from 'react-icons/ai'
import {FaFirefoxBrowser} from 'react-icons/fa'
import {SiYoutubegaming} from 'react-icons/si'
import ContextChanges from '../../Context/ContextChanges'
import {FilterContainer} from './styledComponents'

import './index.css'

const FilterSection = () => (
  <ContextChanges.Consumer>
    {value => {
      const {isDarkTheme} = value

      const filterTextColor = isDarkTheme ? '#ebebeb' : '#909090'
      return (
        <FilterContainer
          color={filterTextColor}
          className="filter-section-main-container"
        >
          <div className="top-filter-main-section">
            <div>
              <Link to="/" className="home-container">
                <AiFillHome className="filter-icon" />
                <p className="option">Home</p>
              </Link>
            </div>
            <div>
              <Link to="/trending" className="trending-container">
                <FaFirefoxBrowser className="filter-icon" />
                <p className="option">Trending</p>
              </Link>
            </div>
            <div>
              <Link to="/gaming" className="gaming-container">
                <SiYoutubegaming className="filter-icon" />
                <p className="option">Gaming</p>
              </Link>
            </div>
            <div>
              <Link to="/saved-videos" className="saved-container">
                <RiPlayListAddLine className="filter-icon" />
                <p className="option">Saved Videos</p>
              </Link>
            </div>
          </div>
          <div className="footer-bottom-section">
            <p className="footer-start-text">Contact Us</p>
            <div className="short-form-image-container">
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-watch-facebook-logo-img.png"
                alt="facebook logo"
                className="logo-image"
              />
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-watch-twitter-logo-img.png"
                alt="twitter logo"
                className="logo-image"
              />
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-watch-linked-in-logo-img.png"
                alt="linked in logo"
                className="logo-image"
              />
            </div>
            <p className="filter-end-text">
              Enjoy! Now to see your channels and recommendations!
            </p>
          </div>
        </FilterContainer>
      )
    }}
  </ContextChanges.Consumer>
)
export default FilterSection
