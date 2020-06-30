import DataTable from "./DataTable"
import Pagination from "./Pagination"

const components = {
  install: function(Vue) {
    Vue.component("DataTable", () => import("./DataTable"));
    Vue.component("MyPagination", () => import("./Pagination"));
  }
}

export default components

