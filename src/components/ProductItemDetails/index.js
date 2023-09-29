import './index.css'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {Component} from 'react'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProducts: [],
    count: 1,
    apiStatusConstants: apiStatus.initial,
  }

  componentDidMount() {
    this.getProductItem()
  }

  updateCaseChange = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    brand: data.brand,
    totalReviews: data.total_reviews,
    rating: data.rating,
    availability: data.availability,
    price: data.price,
    description: data.description,
  })

  getProductItem = async () => {
    this.setState({apiStatusConstants: apiStatus.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const token = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    console.log(response)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = this.updateCaseChange(data)
      const similarProductsList = data.similar_products.map(eachItem =>
        this.updateCaseChange(eachItem),
      )
      this.setState({
        productData: updatedData,
        similarProducts: similarProductsList,
        apiStatusConstants: apiStatus.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatusConstants: apiStatus.failure})
    }
  }

  onDecrementItems = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  onIncreaseItems = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  onResetPreviousPage = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderNoOfItemsAdded = () => {
    const {count} = this.state
    return (
      <div className="adding-container">
        <button
          type="button"
          className="dash-square"
          data-testid="minus"
          onClick={this.onDecrementItems}
        >
          <BsDashSquare />
        </button>
        <p className="count">{count}</p>
        <button
          type="button"
          data-testid="plus"
          onClick={this.onIncreaseItems}
          className="dash-plus"
        >
          <BsPlusSquare />
        </button>
      </div>
    )
  }

  renderSuccessPage = () => {
    const {productData, similarProducts} = this.state
    const {
      imageUrl,
      title,
      availability,
      brand,
      totalReviews,
      rating,
      price,
      description,
    } = productData
    return (
      <>
        <div className="product-top-container">
          <img src={imageUrl} alt="product" className="render-image" />
          <div className="product-details-container">
            <h1 className="product-details-heading">{title}</h1>
            <p className="product-details-cost">Rs {price}/</p>
            <div className="product-details-reviews">
              <p className="review-element">{rating}</p>
              <p className="review-paragraph">{totalReviews} reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="review-tags">Available : {availability}</p>
            <p className="review-brand-tags">Brand : {brand}</p>
            <hr />
            {this.renderNoOfItemsAdded()}
            <button type="button" className="cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <>
          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="similar-products-container">
            {similarProducts.map(each => (
              <SimilarProductItem objectList={each} key={each.id} />
            ))}
          </ul>
        </>
      </>
    )
  }

  renderLoadingPage = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailurePage = () => (
    <div className="not-found-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="not-found-image"
      />
      <h1 className="not-found-para">Product Not Found</h1>
      <button
        type="button"
        className="continue-button"
        onClick={this.onResetPreviousPage}
      >
        Continue shopping
      </button>
    </div>
  )

  renderPage = () => {
    const {apiStatusConstants} = this.state

    switch (apiStatusConstants) {
      case apiStatus.success:
        return this.renderSuccessPage()
      case apiStatus.failure:
        return this.renderFailurePage()
      case apiStatus.inProgress:
        return this.renderLoadingPage()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="product-details-container">
        <Header />
        {this.renderPage()}
      </div>
    )
  }
}

export default ProductItemDetails
