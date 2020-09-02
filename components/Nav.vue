<template>
  <div>
    <router-link class="link-router" to="/"
      ><p class="ant">Home</p></router-link
    >

    <router-link class="link-router" to="/register">
      <p class="ant">Register</p>
    </router-link>
    <router-link class="link-router" to="/login">
      <p class="ant">Login</p>
    </router-link>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
<style>
.ant {
  color: #fff;
  text-transform: uppercase;
  font-weight: 700;
  display: inline;
  margin-right: 10%;
}
</style>
