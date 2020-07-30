import React, { Component } from "react";
import swal from "sweetalert";

import _ from "lodash";
import axios from "../api/axios";

class EditProduct extends Component {
  state = {
    id: null,
    name: null,
    description: null,
    price: null,
    category: null,
    type: null,
    error: null,
    images: [],
    files: [],
    previewUrl: [],
    imagesToDelete: [],
  };

  componentDidMount = async () => {
    const id = this.props.match.params.id;

    this.setState({ id });

    try {
      const response = await axios.get(`/products/product/${id}`);

      const product = response.data;
      let newURLs = [];
      product.images.map((image) => {
        newURLs.push({
          imageURL: "https://dulcecultura.s3.amazonaws.com/" + image.imageURL,
          id: image._id,
        });
      });

      this.setState({
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price / 100,
        type: product.type,
        category: product.category,
        previewUrl: newURLs,
      });

      if (response) console.log(this.state.previewUrl);
    } catch (error) {
      console.log(error);
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.files !== this.state.files) {
      console.log(this.state.files);
      this.state.files.map((file) => {
        const fileReader = new FileReader();

        fileReader.onload = () => {
          const image = _.find(this.state.previewUrl, (image) => {
            return image.imageURL === fileReader.result;
          });
          if (!image)
            this.setState({
              previewUrl: this.state.previewUrl.concat({
                imageURL: fileReader.result,
                file: file.name,
              }),
            });
        };

        fileReader.readAsDataURL(file);
      });
      console.log(this.state.previewUrl);
    }

    if (prevState.imagesToDelete !== this.state.imagesToDelete)
      console.log(this.state.imagesToDelete);
  }

  postUpdate = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    const token = user.token;
    const { name, description, price, category, type, files } = this.state;

    try {
      if (!files || !name || !description || !price || !category || !type)
        throw new Error("Please fill all the fields");

      let formData = new FormData();
      this.state.files.map((file) => {
        formData.append("upload", file);
      });

      formData.append("name", this.state.name);
      formData.append("description", this.state.description);
      formData.append("price", _.toInteger(this.state.price * 100));
      formData.append("category", this.state.category);
      formData.append("type", this.state.type);
      formData.append(
        "imagesToDelete",
        JSON.stringify(this.state.imagesToDelete)
      );

      const response = await axios.patch(
        `/products/${this.state.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        return swal(
          "Success",
          "You successfully updated this product!",
          "success"
        );
      }
    } catch (error) {
      return swal("Warning", error.message, "error");
    }
  };

  updateImage = (async) => {};

  onChange = (e) => {
    const { name, details, price, category } = this.state;
    if (!(name === "" || details === "" || price === "" || category === "")) {
      this.setState({ error: null });
    }
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  onImageChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length !== 0) {
      const uploadedFiles = Array.from(e.target.files);

      const filesLen = uploadedFiles.length;

      if (
        filesLen > 2 ||
        this.state.previewUrl.length > 2 ||
        this.state.files.length > 2 ||
        filesLen + this.state.files.length > 2
      ) {
        return this.setState({
          error: "You can't upload more than 2 images per product.",
        });
      }
      const filesToPush = _.difference(uploadedFiles, this.state.files);
      console.log(filesToPush);
      if (!_.isEmpty(filesToPush))
        this.setState({ files: this.state.files.concat(filesToPush) });
      else
        this.setState({
          error: "You can't add the same image more than once!",
        });
    }
  };

  deleteImage = (image, id, fileName) => {
    let arrayPreview = this.state.previewUrl;
    _.remove(arrayPreview, (obj) => {
      return obj.imageURL === image;
    });
    this.setState({ previewUrl: arrayPreview });

    let arrayFiles = this.state.files;
    _.remove(arrayFiles, (obj) => {
      return obj.name === fileName;
    });
    this.setState({ files: arrayFiles });

    console.log(id);
    if (id)
      this.setState({
        imagesToDelete: this.state.imagesToDelete.concat({ id }),
      });
  };

  renderForm = () => {
    return (
      <>
        <div className="images-list">
          {!_.isEmpty(this.state.previewUrl) && this.renderImages()}
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
                name="description"
                onChange={this.onChange}
                value={this.state.description}
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
                onClick={this.postUpdate}
              >
                Edit this product
              </button>
            </div>
          </div>
        </form>
      </>
    );
  };

  renderImages = () => {
    return this.state.previewUrl.map((image) => {
      return (
        <div className="col-sm-6 col-xs-6 col-md-4 ">
          <img className="img-fluid border" src={image.imageURL} alt="" />
          <div className="ui two buttons">
            <button
              className="ui basic orange button"
              onClick={() => {
                this.deleteImage(image.imageURL, image.id, image.file);
              }}
            >
              Delete This Image
            </button>
          </div>
        </div>
      );
    });
  };

  render() {
    if (this.state.error) {
      swal("Warning", this.state.error, "error");
    }
    return (
      <div className="ui container mt-5">
        <div className="ui segment">
          <div className="ui centered header mt-5 mb-5">Edit your product</div>
        </div>
        {this.renderForm()}
      </div>
    );
  }
}

export default EditProduct;
