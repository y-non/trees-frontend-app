// import "primevue/resources/themes/saga-blue/theme.css"; // Change the theme if needed
// import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import PrimeVue from "primevue/config";

import Aura from "@primevue/themes/aura";
export default ({ app }) => {
  app.use(PrimeVue, {
    // Default theme configuration
    theme: {
      preset: Aura,
      options: {
        prefix: "p",
        darkModeSelector: "light",
        cssLayer: false,
      },
    },
  });
};
