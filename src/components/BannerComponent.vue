<template>
  <div id="main-banner">
    <h1>Pizza Artesanal de Forno a Lenha</h1>
  </div>
</template>

<script>
export default {
  name: "BannerComponent",
};
</script>

<style scoped>
#main-banner {
  background-image: url("~@/assets/banner.png");
  background-position: center;
  background-size: cover;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

#main-banner h1 {
  font-size: 40px;
  color: white;
  text-align: center;
  background: #333;
  padding: 25px;
  border-radius: 100px 0px 0px 100px;
}
</style>
