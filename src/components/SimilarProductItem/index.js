import './index.css'

const SimilarProductItem = props => {
  const {objectList} = props
  const {title, imageUrl, rating, brand, price} = objectList
  return (
    <li className="product-list-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="product-list-thumbnail"
      />
      <h1 className="product-list-title">{title}</h1>
      <p className="product-list-brand">by {brand}</p>
      <div className="product-list-details">
        <p className="product-list-price">Rs {price}/-</p>
        <div className="product-list-rating-container">
          <p className="product-list-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="product-list-star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
