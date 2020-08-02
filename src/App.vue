<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <h3>dIcons</h3>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <RegisterIcon />
      <ListIcons />
    </v-main>
  </v-app>
</template>

<script>
import RegisterIcon from "./components/RegisterIcon";
import ListIcons from "./components/ListIcons";

export default {
  name: "App",

  components: {
    RegisterIcon,
    ListIcons
  },

  data: () => ({
    //
  })
};
</script>
