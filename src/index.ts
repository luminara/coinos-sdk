const axios = require("axios");
axios.defaults.baseURL = "https://coinos.io";

class Client {
  private TOKEN: string;
  /**
   * @param {string} token Auth token for the user account you want to login to
   */
  constructor(token: string) {
    this.TOKEN = token;

    axios.defaults.headers.common["Cookie"] = "token=" + this.TOKEN;
    axios.defaults.headers.common["Authorization"] = "bearer " + this.TOKEN;
    axios.get("/api/me").catch(() => {
      throw new Error("not able to authenticate");
    });
  }

  /**
   * @description Get the account balance in Sats.
   */
  async getBalance(): Promise<number | Error> {
    try {
      return await (
        await axios.get("/api/me")
      ).data.account.balance;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * @param {string} amount Amount of Sats for the invoice.
   */
  async createInvoice(amount: string | number): Promise<string | Error> {
    try {
      amount = typeof amount === "string" ? amount + ".00" : amount;

      let notAssignedInvoice: string = await (
        await axios.post("/api/lightning/invoice", {
          amount: amount,
        })
      ).data;

      let assignedInvoice = await axios.post("/api/invoice", {
        invoice: {
          text: notAssignedInvoice,
          network: "bitcoin",
        },
        user: await (await axios.get("/api/me")).username,
      });

      return assignedInvoice.data.text;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   *
   * @description Get the server funds info
   */
  async serverFunds(): Promise<{
    bitcoin: number;
    liquid: number;
    lightning: number;
    total: number;
  }> {
    try {
      let res = await (await axios.get("/api/balances")).data;

      return {
        bitcoin: res.bitcoin,
        liquid: res.liquid,
        lightning: res.lnchannel,
        total: res.total,
      };
    } catch (err) {
      throw new Error(err);
    }
  }
}

export = Client;
