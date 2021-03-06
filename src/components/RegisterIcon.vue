<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col cols="4">
        <v-card-title>
          Register an icon for your smart contract
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="scAddress"
            name="Smart Contract Address"
            label="Smart Contract Address"
            placeholder="0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"
          ></v-text-field>
          <v-text-field
            v-model="scName"
            name="Smart Contract Name"
            label="Smart Contract Name"
            placeholder="Maker"
          ></v-text-field>
          <v-text-field
            v-model="scType"
            name="Smart Contract Type"
            label="Smart Contract Type"
            placeholder="ERC20"
          ></v-text-field>
          <div class="d-flex flex-no-wrap justify-space-between">
            <v-file-input
              class="w-50"
              @change="addFiles()"
              label="File input"
              v-model="files"
            ></v-file-input>
            <v-img
              :src="uploadedImg"
              height="32px"
              contain
              class="pt-12 mt-2"
            ></v-img>
          </div>

          <v-alert :type="status1" icon="cloud_upload" dense>
            {{ alert1Text }}
          </v-alert>
          <v-alert :type="status2" icon="playlist_add" dense>
            {{ alert2Text }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn small color="primary" @click="connectMM" :loading="loadingMM">
            Connect MetaMask
          </v-btn>
          <v-btn small color="primary" @click="uploadPinata" :loading="loading">
            Register
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { registerIcon, getMMAccount, getValueFromAdd } from "../web3.service";
import axios from "axios";
import FormData from "form-data";

export default {
  data() {
    return {
      scAddress: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
      scName: "Maker",
      scType: "ERC20",
      loading: false,
      loadingMM: false,
      status1: "info",
      status2: "info",
      alert1Text: "Upload status",
      alert2Text: "Registration status",
      files: [],
      readers: [],
      uploadedImg: ""
    };
  },
  methods: {
    connectMM() {
      this.loadingMM = true;
      getMMAccount().then(account => {
        console.log(account);
      });
      this.loadingMM = false;
    },
    addFiles() {
      // console.log("files", this.files);
      this.readers[0] = new FileReader();
      this.readers[0].onloadend = () => {
        let fileData = this.readers[0].result;

        // console.log("Filedata:", fileData);
        this.uploadedImg = fileData;
      };
      this.readers[0].readAsDataURL(this.files);
    },
    async uploadPinata() {
      this.loading = true;
      if (
        this.scAddress === "" ||
        this.scName === "" ||
        this.scType === "" ||
        this.uploadedImg === ""
      ) {
        this.alert1Text = "Check that your input is complete";
        this.alert2Text = "Registration status";
        this.status1 = "error";
        this.status2 = "info";
        this.loading = false;
        return;
      }
      const registeredData = await getValueFromAdd(this.scAddress);
      if (registeredData.isSet) {
        this.alert1Text = "Smart Contract has already an icon";
        this.status1 = "error";
        this.loading = false;
        return;
      }

      this.alert1Text = "Uploading...";
      this.status1 = "info";

      let pinataApiKey = process.env.VUE_APP_PINATA_API_KEY;
      let pinataSecretApiKey = process.env.VUE_APP_PINATA_API_SECRET;
      const vueComponentInstance = this;

      const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

      let data = new FormData();
      data.append("file", dataURItoBlob(this.uploadedImg));
      const metadata = JSON.stringify({
        name: "test dog"
      });
      data.append("pinataMetadata", metadata);

      let ipfsHash = "";

      return axios
        .post(url, data, {
          maxContentLength: "Infinity", //this is needed to prevent axios from erroring out with large files
          headers: {
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey
          }
        })
        .then(async response => {
          vueComponentInstance.status1 = "success";
          vueComponentInstance.alert1Text = "Successfully uploaded";
          ipfsHash = response.data.IpfsHash;
          // register icon in smart contract
          await registerIcon(
            vueComponentInstance.scAddress,
            ipfsHash,
            vueComponentInstance.scName,
            vueComponentInstance.scType
          );
          // reseting the inputs
          vueComponentInstance.scName = "";
          vueComponentInstance.scAddress = "";
          vueComponentInstance.scType = "";
          vueComponentInstance.files = [];
          vueComponentInstance.uploadedImg = "";
          vueComponentInstance.status2 = "success";
          vueComponentInstance.$store.commit("registeredIcon", true);
          vueComponentInstance.loading = false;
        })
        .catch(async function(error) {
          if (
            error.message ===
            "Returned error: VM Exception while processing transaction: revert"
          ) {
            vueComponentInstance.status2 = "error";
            vueComponentInstance.alert2Text =
              "Are you the owner of the contract?";
            const result = await unpinIpfsHash(ipfsHash);
            if (result) {
              vueComponentInstance.alert1Text = "Successfully removed data";
            } else {
              vueComponentInstance.alert1Text = "Error while removing data";
            }
          }
          console.log(error.message);
          vueComponentInstance.loading = false;
        });
    }
  }
};
function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

async function unpinIpfsHash(hashToUnpin) {
  const url = `https://api.pinata.cloud/pinning/unpin/${hashToUnpin}`;
  return axios
    .delete(url, {
      headers: {
        // eslint-disable-next-line
        "pinata_api_key": process.env.VUE_APP_PINATA_API_KEY,
        // eslint-disable-next-line
        "pinata_secret_api_key": process.env.VUE_APP_PINATA_API_SECRET
      }
    })
    .then(function(response) {
      //handle response here
      console.log("Response", response);
      return true;
    })
    .catch(function(error) {
      //handle error here
      console.log("Error while unpinning", error);
      return false;
    });
}
</script>

<style scoped></style>
