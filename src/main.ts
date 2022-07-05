import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import "@arco-design/web-vue/dist/arco.css";
import "./assets/css/global.scss";
import "animate.css";

createApp(App)
	.use(router)
	.use(createPinia())
	.use(ArcoVue)
	.use(ArcoVueIcon)
	.mount("#app")
	.$nextTick(() => {
		postMessage({ payload: "removeLoading" }, "*");
	});
