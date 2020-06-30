<template>
  <div class="box">
    <iframe :src="url" style="width: 100%;" :style="style">
      
    </iframe>
  </div>
</template>

<script>
  export default {
    name: "Druid",
    data() {
      return {
        url: "http://localhost:8999/druid/login.html",
        style: {
          height: "100px",
          
        }
      }
    },
    mounted() {
      let aa = document.getElementsByClassName("content-body")[0].clientHeight;
      this.style.height = aa - 75 + "px";
      console.log(aa)
    }
  }
</script>

<style>
  .box {
    height: 100%;
    width: 100%;
  }
</style>
