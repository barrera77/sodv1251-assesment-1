import Dashboard from "../components/Dashboard.js";
import Orders from "../components/Orders.js";
import Inventory from "../components/Inventory.js";
import OrderDetail from "../components/OrderDetail.js";
import Customers from "../components/Customers.js";
import Home from "../components/Home.js";
import Promotions from "../components/Promotions.js";
import Reporting from "../components/Reporting.js";
import ProductDetail from "../components/ProductDetail.js";
import ProductsCrud from "../components/ProductsCrud.js";
import CustomersCrud from "../components/CustomersCrud.js";
import PromotionsCrud from "../components/PromotionsCrud.js";

const pathToRegex = (path) =>
  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = (match) => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
    (result) => result[1]
  );

  return Object.fromEntries(
    keys.map((key, i) => {
      return [key, values[i]];
    })
  );
};

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

//Create the routes for the existing pages
const router = async () => {
  const routes = [
    {
      path: "/",
      view: Home,
    },
    {
      path: "/dashboard",
      view: Dashboard,
    },
    {
      path: "/orders",
      view: Orders,
    },

    {
      path: "/orders/:id",
      view: OrderDetail,
    },

    {
      path: "/inventory",
      view: Inventory,
    },
    {
      path: "/product-detail",
      view: ProductDetail,
    },
    {
      path: "/products-crud",
      view: ProductsCrud,
    },
    {
      path: "/customers",
      view: Customers,
    },
    {
      path: "/customers-crud",
      view: CustomersCrud,
    },
    {
      path: "/promotions",
      view: Promotions,
    },
    {
      path: "/promotions-crud",
      view: PromotionsCrud,
    },
    {
      path: "/reporting",
      view: Reporting,
    },
  ];

  //Test Routes
  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });

  let match = potentialMatches.find(
    (potentialMatch) => potentialMatch.result !== null
  );

  //TODO: customize the not found 404 if wanted
  if (!match) {
    match = {
      route: routes[0],
      result: [location.pathname],
    };
  }

  const view = new match.route.view(getParams(match));
  document.querySelector(".app").innerHTML = await view.getHtml();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (event) => {
    if (event.target.matches("[data-link]")) {
      event.preventDefault();
      navigateTo(event.target.href);
    }
  });
  router();
});

/**
 * set active class for all sidebar links
 */
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function () {
    // Remove the active class from all links
    document
      .querySelectorAll(".nav-link")
      .forEach((nav) => nav.classList.remove("active"));

    // Add the active class to the clicked link
    this.classList.add("active");
  });
});
