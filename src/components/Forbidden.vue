<template>
  <a-result status="403" title="403" sub-title="Sorry, you are not authorized to access this page.">
    <template #extra>
      <el-button @click="$router.push('/')">
        Back Home
      </el-button>
    </template>
  </a-result>
</template>


<script>
export default {
  data() {
    return {};
  },
};
</script>
