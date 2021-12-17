import {Component} from 'react'

import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import Popup from 'reactjs-popup'

import {FiSun} from 'react-icons/fi'
import {FaMoon} from 'react-icons/fa'

import ContextChanges from '../../Context/ContextChanges'

import './index.css'

class Header extends Component {
  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  render() {
    return (
      <ContextChanges.Consumer>
        {value => {
          const {isDarkTheme, toggleTheme} = value

          const onClickThemeChange = () => {
            toggleTheme()
          }

          const bgColor = isDarkTheme ? 'dark-bg' : 'light-bg'
          const WebsiteImageUrl = isDarkTheme
            ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-dark-theme-img.png'
            : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png'

          const themeImage = isDarkTheme ? <FiSun /> : <FaMoon />

          return (
            <nav className={`header-main-bg-container ${bgColor}`}>
              <div className="header-container">
                <Link to="/">
                  <img
                    src={WebsiteImageUrl}
                    alt="website logo"
                    className="website-logo"
                  />
                </Link>
                <div className="header-right-container">
                  <button
                    type="button"
                    data-testid="theme"
                    className="theme-change-button"
                    onClick={onClickThemeChange}
                  >
                    {themeImage}
                  </button>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/nxt-watch-profile-img.png"
                    alt="profile"
                    className="profile-image"
                  />
                  <Popup
                    modal
                    trigger={
                      <button type="button" className="logout-button">
                        Logout
                      </button>
                    }
                  >
                    {close => (
                      <div className="pop-up-container">
                        <p className="pop-up-text">
                          Are you sure, you want to logout
                        </p>
                        <div className="buttons-container">
                          <button
                            type="button"
                            className="cancel-button"
                            onClick={() => close()}
                          >
                            cancel
                          </button>
                          <button
                            type="button"
                            onClick={this.onClickLogout}
                            className="confirm-button"
                          >
                            confirm
                          </button>
                        </div>
                      </div>
                    )}
                  </Popup>
                </div>
              </div>
            </nav>
          )
        }}
      </ContextChanges.Consumer>
    )
  }
}

export default withRouter(Header)
