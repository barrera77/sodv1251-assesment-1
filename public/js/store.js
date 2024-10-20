import { itemCardsRow } from "../templates/item-cards-data.js";
import { getData } from "../utils/api-utility.js";

//API edndpoints
const PRODUCTS_ENDPOINT = "/api/products";
const CUSTOMERS_ENDPOINT = "/api/customers";

//Get elements from the DOM
const electronicsContainer = document.querySelector(
  ".row-products-electronics"
);
const appliancesContainer = document.querySelector(".row-products-appliances");
const furnitureContainer = document.querySelector(".row-products-furniture");
const suggestionsContainer = document.querySelector(".row-product-suggestions");
const toggleFormSignIn = document.querySelector("#goto-signin");
const toggleFormRegister = document.querySelector("#goto-register");
const registrationForm = document.querySelector("#customer-registration-form");
const registrationFormInputs = document.querySelectorAll(
  "#customer-registration-form input"
);
const loginFormInputs = document.querySelectorAll(
  "#customer-signin-form input"
);

const invalidFeedbackMessages = document.querySelectorAll(".invalid-feedback");

toggleFormSignIn.addEventListener("click", toggleSignInForm);
toggleFormRegister.addEventListener("click", toggleRegisterForm);

//Get products data
let productsList = await getData(PRODUCTS_ENDPOINT);

//Get the customers data
let customersList = await getData(CUSTOMERS_ENDPOINT);

if (electronicsContainer) {
  //get the products under the category of electronics
  let electronics = findAndSortInventoryByCategory("Electronics");
  electronics.forEach((item) => {
    electronicsContainer.innerHTML += itemCardsRow(item);
  });
}

if (appliancesContainer) {
  //get the products under the category of homeAppliances
  let homeAppliances = findAndSortInventoryByCategory("Home Appliances");
  homeAppliances.forEach((item) => {
    appliancesContainer.innerHTML += itemCardsRow(item);
  });
}

if (furnitureContainer) {
  //get the products under the category of furniture
  let furniture = findAndSortInventoryByCategory("Furniture");
  furniture.forEach((item) => {
    furnitureContainer.innerHTML += itemCardsRow(item);
  });
}

if (suggestionsContainer) {
  productsList.forEach((product) => {
    suggestionsContainer.innerHTML += itemCardsRow(product);
  });
}

/**
 * Create an a list of sorted items by catgory
 * @param {*} category
 * @returns
 */
function findAndSortInventoryByCategory(category) {
  let inventoryItems = productsList.filter(
    (item) => item.category === category && item.IsDiscontinued === false
  );

  const sotedItems = inventoryItems.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return sotedItems;
}

/**
 * Update the items counter from the shopping cart
 */
(function updateShoppingCartItemsCounter() {
  const totalQty = parseInt(localStorage.getItem("quantities")) || 0;
  const cartItemsCounterLabel = document.querySelector(".cart-items");
  cartItemsCounterLabel.textContent = totalQty;
})();

/**
 * Register new customers
 */
function registerNewCustomers(name, address, city, email, phone) {
  //get customer rom the local storage
  let customers = JSON.parse(localStorage.getItem("customers")) || [];

  let newCustomer = {
    id: customersList.length + 1,
    name: name,
    address: address,
    city: city,
    email: email,
    phone: phone,
    status: "Active",
  };

  //check if the customer already exists
  let existingCustomer = customersList.find(
    (customer) => customer.name === newCustomer.name
  );

  if (!existingCustomer) {
    customers.push(newCustomer);
    //add the new customer to the localstorage
    localStorage.setItem("customers", JSON.stringify(customers));
    console.log("new customer: ", newCustomer);
  }
}

//get Registration form data
document
  .querySelector("#customer-registration-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const customerData = Object.fromEntries(formData.entries());
    console.log("data", customerData);

    const isValidForm = validateRegistrationForm(customerData);
    const isValidPhone = validatePhone(customerData.phone);
    console.log(isValidPhone);

    if (isValidForm) {
      console.log(isValidForm);
      if (!isValidPhone) {
        document.querySelector("#invalid-phone").classList.add("d-block");
      } else {
        document.querySelector("#invalid-phone").classList.remove("d-block");

        registerNewCustomers(
          customerData.name,
          customerData.address,
          customerData.city,
          customerData.email,
          customerData.phone
        );

        //reset form fields
        resetForms();
      }
    }
  });

/**
 * remove error message from the fields on input
 */

registrationFormInputs.forEach((input) => {
  input.addEventListener("input", (event) => {
    const inputId = input.id;
    const messageElement = document.getElementById(`invalid-${inputId}`);

    if (input.value) {
      messageElement.classList.remove("d-block");
    }
  });
});

//get Log-in form data
document
  .querySelector("#customer-signin-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const loginData = Object.fromEntries(formData.entries());
    console.log("data", loginData);

    const isValidForm = validateLoginForm(loginData);

    if (isValidForm) {
      //loginCustomer();

      console.log("Welcome Manolin");
    }
  });

loginFormInputs.forEach((input) => {
  input.addEventListener("input", (event) => {
    const inputId = input.id;
    const messageElement = document.getElementById(`invalid-login-${inputId}`);

    if (input.value) {
      messageElement.classList.remove("d-block");
    }
  });
});

/**
 * Toggle to the sign in form if the customer already exists
 * @param {*} event
 */
function toggleSignInForm(event) {
  event.preventDefault(); // Prevent default behavior

  // Toggle visibility of the forms
  document.querySelector("#customer-registration-form").classList.add("d-none");
  document.querySelector("#customer-signin-form").classList.remove("d-none");
  document.querySelector("#customer-signin-form").classList.add("d-block");

  document.querySelector("#form-type").textContent = "Log In";
  document.querySelector("#has-account span").textContent = "Don't";

  // Show the register button, hide the sign-in button
  toggleFormSignIn.classList.add("d-none");
  toggleFormRegister.classList.remove("d-none");
  toggleFormRegister.classList.add("d-inline");
  resetForms();
  resetFeedbaackMessages();
}

/**
 * toggle to the register form if the customer does not have an account
 * @param {*} event
 */
function toggleRegisterForm(event) {
  event.preventDefault(); // Prevent default behavior
  resetForms();
  resetFeedbaackMessages();

  document.querySelector("#customer-signin-form").classList.add("d-none");
  document.querySelector("#customer-signin-form").classList.remove("d-block"); // Ensure the sign-in form is hidden
  document
    .querySelector("#customer-registration-form")
    .classList.remove("d-none");
  document
    .querySelector("#customer-registration-form")
    .classList.add("d-block");

  // Show the sign-in button, hide the register button
  toggleFormRegister.classList.add("d-none");
  toggleFormSignIn.classList.remove("d-none");
  toggleFormSignIn.classList.add("d-inline");
}

/* Helper methods */

/**
 * validate the forms
 */
function validateRegistrationForm(data) {
  let isValid = true;

  isValid = validateField(data.name, "invalid-name") && isValid;
  isValid = validateField(data.address, "invalid-address") && isValid;
  isValid = validateField(data.city !== "0", "invalid-city") && isValid;
  isValid = validateField(data.email, "invalid-email") && isValid;
  isValid = validateField(data.username, "invalid-username") && isValid;
  isValid = validateField(data.password, "invalid-password") && isValid;

  return Boolean(isValid);
}

function validateLoginForm(data) {
  let isValid = true;

  isValid = validateField(data.username, "invalid-login-username") && isValid;
  isValid = validateField(data.password, "invalid-login-password") && isValid;

  return Boolean(isValid);
}

/**
 * validate individual fields
 * @param {*} value
 * @param {*} elementId
 */
function validateField(value, elementId) {
  const messageElement = document.getElementById(elementId);

  if (!value) {
    messageElement.classList.add("d-block");
    return false;
  } else {
    messageElement.classList.remove("d-block");
    return true;
  }
}

function validatePhone(phone) {
  const regex = /^\d{3}-\d{3}-\d{4}$/;
  return regex.test(phone);
}

/**
 * reset the forms
 */
function resetForms() {
  //clear inputs
  document.querySelectorAll(".form-control").forEach((input) => {
    input.value = "";
  });

  //reset dropdowns
  document.querySelectorAll(".form-select").forEach((select) => {
    select.selectedIndex = "0";
  });
}

/**
 * Reset all fedback messages
 */
function resetFeedbaackMessages() {
  invalidFeedbackMessages.forEach((message) => {
    message.classList.remove("d-block");
  });
}
