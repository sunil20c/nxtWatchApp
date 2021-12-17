import './index.css'
import ContextChanges from '../../Context/ContextChanges'

const NotFound = () => (
  <ContextChanges.Consumer>
    {value => {
      const {isDarkTheme} = value
      const imageUrlNf = isDarkTheme
        ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-not-found-light-theme-img.png'
        : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-not-found-dark-theme-img.png'
      return (
        <div className="not-found-container">
          <img src={imageUrlNf} alt="not found" className="not-found-image" />
          <h1 className="nf-heading">Page Not Found</h1>
          <p className="nf-text">
            we are sorry, the page you requested could not be found.
          </p>
        </div>
      )
    }}
  </ContextChanges.Consumer>
)

export default NotFound
