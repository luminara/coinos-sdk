import { Base } from "./base";
import { Invoice } from "./invoice";
import { applyMixins } from "./utils";

class Coinos extends Base {}
interface Coinos extends Invoice {}

applyMixins(Coinos, [Invoice]);

export default Coinos;
