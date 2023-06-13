import { Base } from "./base";

export class Invoice extends Base {
  async generateInvoice(amount: number, type: string) {
    let invoice = await this.request("/invoice", {
      method: "POST",
      body: JSON.stringify({
        invoice: {
          amount: amount,
          type: type,
        },
      }),
    });

    return invoice;
  }
}
