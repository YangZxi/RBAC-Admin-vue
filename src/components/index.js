// import DataTable from "./DataTable"
// import Pagination from "./Pagination"

const components = {
  install: function(Vue) {
    Vue.component("MyPagination", () => import("./Pagination"));
    Vue.component("SearchBar", () => import("./SearchBar"));
  }
}

export default components

