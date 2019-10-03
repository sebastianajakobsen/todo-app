import { extend, localize } from "vee-validate";
import { min, required, email, alpha_num } from "vee-validate/dist/rules";
import en from "vee-validate/dist/locale/en.json";

// Install rules
extend("required", required);
extend("min", min);
extend("email", email);
extend("alpha_num", alpha_num);
// Install messages
localize({
    en
});
