import AbstractView from "./AbstractView.js";
import { getData } from "../utils/api-utility.js";
import ordersDataRow from "../templates/orders-data.js";

const PRODUCTS_ENDPOINT = "/api/products";
const CUSTOMERS_ENDPOINT = "/api/customers";
const ORDERS_ENDPOINT = "/api/orders";
const ORDER_DETAILS_ENDPOINT = "/api/orders-details";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Orders");
  }
  async getHtml() {
    // this.productsList = await getData(PRODUCTS_ENDPOINT);
    this.customersList = await getData(CUSTOMERS_ENDPOINT);
    this.ordersList = await getData(ORDERS_ENDPOINT);
    //this.orderDetailsList = await getData(ORDER_DETAILS_ENDPOINT);

    /*  if (
      this.productsList.length === 0 ||
      this.customersList.length === 0 ||
      this.ordersList.length === 0 ||
      this.orderDetailsList.length === 0
    ) {
      return `<div>No orders found</div>`;
    } */

    if (this.customersList.length === 0 || this.ordersList.length === 0) {
      return `<div>No orders found</div>`;
    }

    const rows = this.ordersList
      .map((order) => {
        const matchingCustomer = this.customersList.find(
          (customer) => customer.id === order.customerId
        );

        return ordersDataRow(order, matchingCustomer);
      })
      .join("");

    return `
    <div>
        <h2 class="pb-3">Orders</h2>
        <a href="/Orders-crud?state=new" data-link class="btn btn-success">+ Add Orders</a>
    </div>
    <div class="table-responsive py-4">
      <table class="table table-striped table-sm">
          <thead class="border-bottom border-secondary">
          <tr>
              <th scope="col" class="text-center">Action</th>
              <th scope="col">Order ID</th>
              <th scope="col">Customer</th>
              <th scope="col">Date</th>
              <th scope="col">Total</th>
              <th scope="col">Payment Status</th>
              <th scope="col">Order Status</th>
          </tr>
          </thead>
          <tbody>
          ${rows}
          </tbody>
      </table>
    </div>
    `;
  }
}
