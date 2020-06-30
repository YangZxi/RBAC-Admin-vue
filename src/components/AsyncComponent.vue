<template>
    <div>
      <is-loading v-if='isLoading'></is-loading>
      <not-found v-if='isError' @reload='load' :errorDetails='errorDetails'></not-found>
      <component :is="nowComponent" v-if="!isLoading && !isError" @changeLoading="changeLoading"></component>
    </div>
</template>

<script>
import IsLoading from "./IsLoading";
import NotFound from "./NotFound";
export default {
  data() {
    return {
      nowComponent: null,
      isLoading: true,
      isError: false,
      errorDetails: ""
    };
  },
  props: {
    componentPath: String,
    delay: Number
  },
  components: {
    IsLoading,
    NotFound
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
            console.log(this.componentPath);
       import(`@/${this.componentPath}`)
        .then(rsp => {
          setTimeout(() => {
            this.nowComponent = () => import(`@/${this.componentPath}`);
            this.isLoading = false;
            this.isError = false;
          }, this.delay);
        })
        .catch(err => {
          this.nowComponent = LoadingError;
          this.isError = true;
          this.isLoading = false;
          this.errorDetails = err.message;
        });
    },
    changeLoading() {
      alert(1)
    }
  }
};
</script>

<style>
    
</style>
