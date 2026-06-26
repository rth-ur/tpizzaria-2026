<template>
  <div>
    <nav id="nav">
      <router-link to="/" id="logo-url">
        <img :src="logo" id="logo" />
      </router-link>
      <router-link to="/menu">Menu</router-link> |
      <router-link to="/pedidos">Pedidos</router-link>
    </nav>
  </div>
</template>

<script>
import logo from "@/assets/logo_tpizzaria.png";

export default {
  name: "NavBarComponent",
  data() {
    return { logo };
  },
};
</script>

<style scoped>
#logo {
  width: 60px;
  height: 60px;
}

#nav #logo-url {
  margin-right: auto;
  margin-left: 0;
}

#nav a {
  color: #e74c3c;
  text-decoration: none;
  margin: 12px;
  transition: 0.5s;
}

#nav a:hover {
  color: white;
  font-size: 20px;
}

#logo-url:hover {
  transform: rotate(360deg);
  transition: transform 0.5s;
}

#nav {
  background-color: #333;
  border-bottom: 3px solid #c0392b;
  padding: 15px 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
