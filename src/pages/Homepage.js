import React, { Component } from "react";
import { connect } from "react-redux";
import swal from "sweetalert";

import Card from "../components/Card";
import "./FeaturedProduct.css";
import { fetchProducts, signInUser, addToCart } from "../actions/index";
import LoadingSpinner from "../components/LoadingSpinner";

class Homepage extends Component {
  state = { ProductMode: "Candy" };

  constructor(props) {
    super(props);
    props.fetchProducts();
  }
  componentDidMount() {
    this.props.fetchProducts();
  }

  AddToCart = (product) => {
    console.log(product);

    this.props.addToCart(product);
  };

  showToast = () => {
    swal("Success", "Product added to your cart!", "success");
  };

  toastOwnItem = () => {
    swal("", "You can not buy your own product", "warning");
  };

  renderProducts = () => {
    return this.props.products.map((product) => {
      if (product.type === this.state.ProductMode) {
        return (
          <Card
            key={product._id}
            user={product.user}
            AddToCart={this.AddToCart}
            id={product._id}
            name={product.name}
            description={product.description}
            price={product.price / 100}
            available={product.available}
            images={product.images}
            toast={this.showToast}
            toastOwnItem={this.toastOwnItem}
          />
        );
      }
    });
  };

  renderFeatured = () => {
    return (
      <div className="featured-main">
        <img
          className="ui fluid image"
          src={require("../img/featured-1.png")}
          alt=" Featured image "
        />
      </div>
    );
  };

  renderMenu = () => {
    return (
      <div className="ui fluid container mt-5">
        <div class="ui orange inverted three item menu">
          <a
            class="item"
            onClick={() => {
              this.setState({ ProductMode: "Candy" });
            }}
          >
            <b>Candy</b>
          </a>
          <a
            class="item"
            onClick={() => {
              this.setState({ ProductMode: "Art" });
            }}
          >
            <b>Art</b>
          </a>
          <a
            class="item"
            onClick={() => {
              this.setState({ ProductMode: "Clothing" });
            }}
          >
            <b>Clothing</b>
          </a>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          style={{ marginTop: "-25px" }}
        >
          <path
            fill="#F2711C"
            fill-opacity="1"
            d="M0,320L7.5,314.7C15,309,30,299,45,266.7C60,235,75,181,90,144C105,107,120,85,135,101.3C150,117,165,171,180,176C195,181,210,139,225,101.3C240,64,255,32,270,64C285,96,300,192,315,208C330,224,345,160,360,160C375,160,390,224,405,213.3C420,203,435,117,450,101.3C465,85,480,139,495,138.7C510,139,525,85,540,106.7C555,128,570,224,585,245.3C600,267,615,213,630,192C645,171,660,181,675,192C690,203,705,213,720,192C735,171,750,117,765,90.7C780,64,795,64,810,101.3C825,139,840,213,855,250.7C870,288,885,288,900,256C915,224,930,160,945,149.3C960,139,975,181,990,208C1005,235,1020,245,1035,240C1050,235,1065,213,1080,197.3C1095,181,1110,171,1125,186.7C1140,203,1155,245,1170,272C1185,299,1200,309,1215,282.7C1230,256,1245,192,1260,160C1275,128,1290,128,1305,117.3C1320,107,1335,85,1350,74.7C1365,64,1380,64,1395,101.3C1410,139,1425,213,1433,250.7L1440,288L1440,0L1432.5,0C1425,0,1410,0,1395,0C1380,0,1365,0,1350,0C1335,0,1320,0,1305,0C1290,0,1275,0,1260,0C1245,0,1230,0,1215,0C1200,0,1185,0,1170,0C1155,0,1140,0,1125,0C1110,0,1095,0,1080,0C1065,0,1050,0,1035,0C1020,0,1005,0,990,0C975,0,960,0,945,0C930,0,915,0,900,0C885,0,870,0,855,0C840,0,825,0,810,0C795,0,780,0,765,0C750,0,735,0,720,0C705,0,690,0,675,0C660,0,645,0,630,0C615,0,600,0,585,0C570,0,555,0,540,0C525,0,510,0,495,0C480,0,465,0,450,0C435,0,420,0,405,0C390,0,375,0,360,0C345,0,330,0,315,0C300,0,285,0,270,0C255,0,240,0,225,0C210,0,195,0,180,0C165,0,150,0,135,0C120,0,105,0,90,0C75,0,60,0,45,0C30,0,15,0,8,0L0,0Z"
          ></path>
        </svg>
      </div>
    );
  };

  render() {
    return (
      <>
        {!this.props.products && <LoadingSpinner />}

        {this.renderFeatured()}

        {this.renderMenu()}

        <div className="ui fluid container mt-5 mb-5 text-center">
          <h2>{this.state.ProductMode}</h2>
        </div>

        <div
          className="ui fluid container mt-5"
          style={{
            marginLeft: "3em",
            marginRight: "3em",
          }}
        >
          <div
            className="ui three stackable cards"
            style={{
              marginLeft: "3em",
              marginRight: "3em",
            }}
          >
            {this.renderProducts()}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return { products: state.products };
};
export default connect(mapStateToProps, {
  fetchProducts,
  signInUser,
  addToCart,
})(Homepage);
