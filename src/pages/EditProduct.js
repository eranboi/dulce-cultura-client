import React, { Component } from "react";
import swal from "sweetalert";

import Modal from "../components/Modal";
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
  };

  componentDidMount = async () => {
    const id = this.props.match.params.id;

    this.setState({ id });

    try {
      const response = await axios.get(`/products/product/${id}`);

      const product = response.data;
      this.setState({
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price / 100,
        type: product.type,
        category: product.category,
      });
    } catch (error) {
      console.log(error);
    }
  };

  postUpdate = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    const token = user.token;
    const { name, description, price, category, type } = this.state;
    const updates = { name, description, price: price * 100, category, type };

    try {
      if (!name || !description || !price || !category || !type)
        throw new Error("Please fill all the fields");
      const response = await axios.patch(
        `/products/${this.state.id}`,
        updates,
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

  onChange = (e) => {
    const { name, details, price, category } = this.state;
    if (!(name === "" || details === "" || price === "" || category === "")) {
      this.setState({ error: null });
    }
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  renderForm = () => {
    return (
      <form>
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
    );
  };

  render() {
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
