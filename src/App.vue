<template>
  <v-app>
    <div class="app-background fill-height d-flex justify-center align-center">
      <router-view />
    </div>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
.app-background {
  background-image: url("src/assets/wallpaper.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
}

html,
body,
.v-application {
  height: 100%;
  margin: 0;
  padding: 0;
}

.fill-height {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
