<template>
  <v-form>
    <v-container>
      <v-row align="center">
        <v-col class="text-center" cols="5">
          <v-text-field
            label="Address"
            v-model="searchAddress"
            solo
          ></v-text-field>
        </v-col>

        <v-col class="text-center" cols="2">
          <v-btn small color="primary" @click="getSomeValue">Get</v-btn>
        </v-col>

        <v-col class="text-center" cols="5">
          <v-text-field label="Value" v-model="searchValue" solo></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col class="text-center" cols="5">
          <v-text-field
            label="Address"
            v-model="targetAddress"
            solo
          ></v-text-field>
        </v-col>

        <v-col class="text-center" cols="5">
          <v-text-field label="Value" v-model="targetValue" solo></v-text-field>
        </v-col>
        <v-col class="text-center" cols="2">
          <v-btn small color="primary" @click="setSomeValue">Set</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { setValueToAdd, getValueFromAdd } from "../web3.service";
export default {
  data() {
    return {
      searchAddress: "",
      searchValue: "",
      targetAddress: "",
      targetValue: ""
    };
  },
  methods: {
    async setSomeValue() {
      await setValueToAdd(this.targetAddress, this.targetValue);
    },
    async getSomeValue() {
      let value = await getValueFromAdd(this.searchAddress);
      this.searchValue = value;
    }
  }
};
</script>

<style lang="scss" scoped></style>
