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
          <v-file-input
            @change="addFiles()"
            label="File input"
            v-model="files"
          ></v-file-input>
          <v-img :src="uploadedImg" contain></v-img>
          <!-- <v-text-field label="Value" v-model="targetValue" solo></v-text-field> -->
        </v-col>
        <v-col class="text-center" cols="2">
          <v-btn small color="primary" @click="uploadPinata">Set</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { setValueToAdd, getValueFromAdd } from "../web3.service";
import axios from "axios";
import FormData from "form-data";

export default {
  data() {
    return {
      searchAddress: "",
      searchValue: "",
      targetAddress: "",
      targetValue: "",
      files: [],
      readers: [],
      uploadedImg: ""
    };
  },
  methods: {
    async setSomeValue() {
      await setValueToAdd(this.targetAddress, this.targetValue);
    },
    async getSomeValue() {
      let value = await getValueFromAdd(this.searchAddress);
      this.searchValue = value;
    },
    addFiles() {
      console.log("files", this.files);
      this.readers[0] = new FileReader();
      this.readers[0].onloadend = () => {
        let fileData = this.readers[0].result;

        console.log(fileData);
        this.uploadedImg = fileData;
      };
      this.readers[0].readAsDataURL(this.files);
    },
    uploadPinata() {
      let pinataApiKey = "24e61ab582bad9ed68ba";
      let pinataSecretApiKey =
        "00de21ef13501946f234b914316320efc380807387e3ae91bbe6b3e9fa5c66e2";

      const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

      let data = new FormData();
      data.append("file", dataURItoBlob(this.uploadedImg));

      const metadata = JSON.stringify({
        name: "test dog"
      });
      data.append("pinataMetadata", metadata);

      return axios
        .post(url, data, {
          maxContentLength: "Infinity", //this is needed to prevent axios from erroring out with large files
          headers: {
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey
          }
        })
        .then(function(response) {
          console.log(response);
          //handle response here
        })
        .catch(function(error) {
          console.log(error);
          //handle error here
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

  //Old Code
  //write the ArrayBuffer to a blob, and you're done
  //var bb = new BlobBuilder();
  //bb.append(ab);
  //return bb.getBlob(mimeString);

  //New Code
  return new Blob([ab], { type: mimeString });
}
</script>

<style lang="scss" scoped></style>
