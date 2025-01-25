<script setup>
import { storageUtil } from "src/utils/storageUtil";
import { onMounted } from "vue";

onMounted(() => {
  const orderCode = storageUtil.getLocalStorageData("orderCode");
  console.log(orderCode);
});
</script>

<template>
  <div></div>
</template>

<style lang="scss" scoped></style>
