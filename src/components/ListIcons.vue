<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4" v-for="item in entries" :key="item['0']">
        <v-card>
          <v-card-title>
            <v-avatar>
              <img :src="'https://ipfs.io/ipfs/' + item.path" />
            </v-avatar>
            {{ item.name }}
          </v-card-title>
          <v-card-text class="text--primary">
            <div>Type: {{ item.type }}</div>
            <div>Path: {{ item.path }}</div>
            <div>Address: {{ item.address }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getSmartContractAddresses, getValueFromAdd } from "../web3.service";

export default {
  data() {
    return {
      entries: []
    };
  },
  methods: {
    loadEntries: async function() {
      this.entries = [];

      getSmartContractAddresses().then(async addresses => {
        for (let i = 0; i < addresses.length; i++) {
          const r = await getValueFromAdd(addresses[i]);
          let data = {
            path: r["_path"],
            name: r["_name"],
            type: r["_type"],
            address: addresses[i]
          };
          this.entries.push(JSON.parse(JSON.stringify(data)));
        }
      });
    }
  },
  created: async function() {
    this.loadEntries();
  },
  computed: {
    registeredIcons() {
      return this.$store.getters.registeredIcons;
    }
  },
  watch: {
    registeredIcons(newValue) {
      if (newValue === true) {
        this.$store.commit("registeredIcon", false);
        this.loadEntries();
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
