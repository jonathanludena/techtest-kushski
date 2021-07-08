import { useState } from "react";
import { Kushki } from "@kushki/js";
import axios from "axios";

import testCards from "./utils/testCards";
import style from "./App.module.css";

const kushki = new Kushki({
  merchantId: process.env.REACT_APP_MERCHANT_ID,
  inTestEnvironment: true,
});

const App = () => {
  const [data, setData] = useState({
    number: "",
    name: "",
    expiry_month: "",
    expiry_uear: "",
    cvc: "",
  });

  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    kushki.requestToken(
      {
        amount: "49.99",
        currency: "USD",
        card: {
          name: data.name,
          number: data.number.replace(/ /g, ""),
          cvc: data.cvc,
          expiryMonth: data.expiry_month,
          expiryYear: data.expiry_uear,
        },
      },
      (response) => {
        axios
          .post("https://api-pagos-kushki.herokuapp.com/api/cards", {
            amount: 49.99,
            token: response.token,
          })
          .then((response) => {
            console.log(response.data);
            alert(
              `😁👌🏻 ${response.data.details.responseText}. Ticket #${response.data.ticketNumber}`
            );
            setSuccess(response.data);
          })
          .catch((error) => {
            alert(`😥😮 Transacción declinada`);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    );
  };

  const handleTestApproved = () => {
    const { approved } = testCards;
    setData({
      number: approved.number,
      name: approved.name,
      cvc: approved.cvc,
      expiry_month: approved.expiry_month,
      expiry_uear: approved.expiry_uear,
    });
  };
  const handleTestDeclined = () => {
    const { declined } = testCards;
    setData({
      number: declined.number,
      name: declined.name,
      cvc: declined.cvc,
      expiry_month: declined.expiry_month,
      expiry_uear: declined.expiry_uear,
    });
  };

  return (
    <div className={style.App}>
      {isLoading ? (
        <h1>Loading..</h1>
      ) : (
        <div className={style.paymentForm}>
          <img
            src="https://uat-console.kushkipagos.com/static/media/logo.3a61df33.svg"
            alt="kushki_logo"
          />
          <h3>
            PAGOS ÚNICOS <br />
            CON TARJETA DE CRÉDITO
          </h3>
          <form onSubmit={handleSubmit}>
            <div className={style.formGroup}>
              <label htmlFor="number">Card Number</label>
              <input
                placeholder="Card Number"
                type="text"
                name="number"
                value={data.number}
                onChange={handleChange}
              />
            </div>
            <div className={style.formGroup}>
              <label htmlFor="name">Card Name</label>
              <input
                placeholder="Full Name"
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
              />
            </div>
            <div className={style.formMMYYCVC}>
              <div className={style.fieldsMMYYCVC}>
                <label htmlFor="expiry_month">MM</label>
                <input
                  placeholder="MM"
                  type="number"
                  min="1"
                  max="12"
                  name="expiry_month"
                  value={data.expiry_month}
                  onChange={handleChange}
                />
              </div>
              <div className={style.fieldsMMYYCVC}>
                <label htmlFor="expiry_year">YY</label>
                <input
                  placeholder="YY"
                  type="number"
                  min="21"
                  max="24"
                  name="expiry_uear"
                  value={data.expiry_uear}
                  onChange={handleChange}
                />
              </div>
              <div className={style.fieldsMMYYCVC}>
                <label htmlFor="cvc">CVC</label>
                <input
                  placeholder="CVC"
                  type="text"
                  name="cvc"
                  value={data.cvc}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button type="submit">Pay $49.99 with Kushki</button>
          </form>
          <div className={style.Test}>
            <h3>Test Actions</h3>
            <div className={style.btnActionTest}>
              <button
                type="button"
                className={style.btnTestApproved}
                onClick={handleTestApproved}
              >
                Test Approved
              </button>
              <button
                type="button"
                className={style.btnTestDeclined}
                onClick={handleTestDeclined}
              >
                Test Declined
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
