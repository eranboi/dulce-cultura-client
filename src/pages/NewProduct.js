import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";
import swal from "sweetalert";

import "./NewProduct.css";

import { connect } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner";
class NewProduct extends Component {
  state = {
    files: [],
    previewUrl: [],
    isValid: false,
    name: "",
    details: "",
    price: "",
    category: "Merengues",
    type: "Candy",
    processing: false,
    error: null,
    user: null,
    success: false,
  };

  componentDidMount = () => {
    if (this.props.auth.user) {
      this.setState({ user: this.props.auth.user.user });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.auth.user == null && this.props.auth.user != null) {
      this.setState({ user: this.props.auth.user.user });
      if (this.props.auth.user.user.role === "user")
        this.props.history.push("/");
    }

    if (prevState.error !== this.state.error) {
      if (this.state.error)
        this.setState({
          processing: false,
        });
    }

    if (prevState.isValid !== this.state.isValid) {
      this.state.files.map((file) => {
        const fileReader = new FileReader();

        fileReader.onload = () => {
          this.setState({
            previewUrl: this.state.previewUrl.concat(fileReader.result),
          });
        };

        fileReader.readAsDataURL(file);
      });
    }
  }

  postProduct = async (e) => {
    e.preventDefault();

    this.setState({ processing: true, success: false });

    let formData = new FormData();

    const { files, name, details, price, category, type } = this.state;
    if (
      !files ||
      name === "" ||
      details === "" ||
      price === "" ||
      category === "" ||
      type === ""
    ) {
      return this.setState({
        error: "Please fill all the fields",
        files: [],
        previewUrl: [],
        name: "",
        details: "",
        price: "",
        category: "",
        type: "",
      });
    }

    this.state.files.map((file) => {
      formData.append("upload", file);
    });

    formData.append("name", this.state.name);
    formData.append("description", this.state.details);
    formData.append("price", _.toInteger(this.state.price * 100));
    formData.append("category", this.state.category);
    formData.append("type", this.state.type);

    try {
      const response = await axios.post(
        "https://vast-forest-19749.herokuapp.com/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${this.props.auth.user.token}`,
          },
        }
      );

      if (response.status === 201) {
        this.setState({
          processing: false,
          files: [],
          previewUrl: [],
          name: "",
          details: "",
          price: "",
          category: "Merengues",
          success: true,
          error: null,
        });
        swal("Success!", "Product uploaded", "success");
      }
    } catch (error) {
      swal("Error!", this.state.error, "error");

      console.log("Error here");
      console.log(error);
      return this.setState({ error: error.response.data.error });
    }
  };

  onChange = (e) => {
    const { files, name, details, price, category } = this.state;
    if (
      !(
        !files ||
        name === "" ||
        details === "" ||
        price === "" ||
        category === ""
      )
    ) {
      this.setState({ error: null });
    }
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  onImageChange = (e) => {
    if (e.target.files && e.target.files.length !== 0) {
      const uploadedFiles = Array.from(e.target.files);

      const filesLen = uploadedFiles.length;

      if (filesLen > 3) {
        return this.setState({
          error: "You can't upload more than 3 images per product.",
        });
      }
      this.setState({ files: uploadedFiles, isValid: true });
    }
  };

  renderForm = () => {
    return (
      <>
        <div className="images-list">
          {this.state.previewUrl && this.renderImages()}
        </div>
        <form>
          <div className="custom-file mt-5">
            <input
              type="file"
              className="custom-file-input"
              id="customFile"
              multiple="multiple"
              accept=".jpg,.jpeg,.png"
              onChange={this.onImageChange}
            />
            <label className="custom-file-label" htmlFor="customFile">
              Choose images for product
            </label>
          </div>

          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <input
                type="text"
                className="form-control mt-3"
                name="name"
                placeholder="Product Name"
                onChange={this.onChange}
                value={this.state.name}
              />
              <textarea
                type="text"
                className="form-control mt-3"
                placeholder="Details of product"
                name="details"
                onChange={this.onChange}
                value={this.state.details}
              />
            </div>

            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <input
                type="number"
                min="1"
                step="any"
                className="form-control mt-3"
                placeholder="Product Price"
                name="price"
                onChange={this.onChange}
                value={this.state.price}
              />
              <small className="text-muted">
                Use a comma in product price. Eg. 1,99 or 15,00
              </small>

              <select
                name="category"
                className="form-control mt-3"
                onChange={this.onChange}
                value={this.state.category}
              >
                <option value="Merengues">Merengues</option>
                <option value="Palanquetas">Palanquetas</option>
                <option value="Dulce de ate">Dulce de ate</option>
                <option value="Membrillos enchilados">
                  Membrillos enchilados
                </option>
                <option value="Glorias">Glorias</option>
                <option value="Cocadas">Cocadas</option>
                <option value="Obleas">Obleas</option>
                <option value="Cacahuate y nuez garapiñada">
                  Cacahuate y nuez garapiñada
                </option>
                <option value="Macarrones de leche">Macarrones de leche</option>
                <option value="Alegrías">Alegrías</option>
                <option value="Alfajores">Alfajores</option>
                <option value="Fruta cristalizada">Fruta cristalizada</option>
                <option value="Camotes">Camotes</option>
                <option value="Jamoncillo">Jamoncillo</option>
                <option value="Tamarindos">Tamarindos</option>
                <option value="Palomitas acarameladas">
                  Palomitas acarameladas
                </option>
                <option value="Borrachitos">Borrachitos</option>
                <option value="Mueganos">Mueganos</option>
                <option value="Cajeta">Cajeta </option>
                <option value="Calaveras de azúcar">Calaveras de azúcar</option>
                <option value="Pan de dulce?">Pan de dulce?</option>
                <option value="Rollo de guayaba">Rollo de guayaba</option>
                <option value="Rollo de frutas">Rollo de frutas</option>
                <option value="Tortitas de santa clara">
                  Tortitas de santa clara
                </option>
                <option value="Dulces de la tia sara">
                  Dulces de la tia sara
                </option>
                <option value="Dulces enchilados">Dulces enchilados</option>
                <option value="Empanadas">Empanadas</option>
                <option value="Mostachones">Mostachones</option>
                <option value="Polvorones sevillanos">
                  Polvorones sevillanos
                </option>
                <option value="Chocolates oaxaqueños">
                  Chocolates oaxaqueños
                </option>
                <option value="Mazapanes">Mazapanes</option>
                <option value="Gaznates">Gaznates</option>
                <option value="Buñuelos">Buñuelos</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-sm-12 mt-3"></div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6">
              <select
                name="type"
                className="form-control mt-3"
                onChange={this.onChange}
                value={this.state.type}
              >
                <option value="Candy">Candy</option>
                <option value="Art">Art</option>
                <option value="Clothing">Clothing</option>
              </select>
            </div>

            <div className="col-xs-6 col-sm-6 col-md-6">
              <button
                className="btn btn-secondary mt-3"
                onClick={this.postProduct}
              >
                Add a New Product
              </button>
            </div>
          </div>
        </form>
      </>
    );
  };

  renderImages = () => {
    return this.state.previewUrl.map((url) => {
      return (
        <div className="col-sm-6 col-xs-6 col-md-4 ">
          <img className="img-fluid border" src={url} alt="" />
        </div>
      );
    });
  };

  renderPage = () => {
    if (this.state.user.status === "active") {
      return (
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-12 mx-auto">
          {!this.state.processing && this.renderForm()}
          {this.state.processing && <LoadingSpinner />}
        </div>
      );
    }
  };

  render() {
    return (
      <div className="row mt-5">
        {this.state.user && this.renderPage()}
        {!this.state.user && <LoadingSpinner />}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { auth: state.auth };
};

export default connect(mapStateToProps)(NewProduct);
