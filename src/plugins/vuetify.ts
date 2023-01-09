/* eslint-disable prettier/prettier */
 // Vuetify
import * as directives from "vuetify/directives";
import * as components from "vuetify/components";
import { createVuetify } from "vuetify";

// Styles
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

const vuetify = createVuetify({
  components,
  directives,
});

// eslint-disable-next-line prettier/prettier
export default vuetify;
