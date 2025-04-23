import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe , useElements } from "@stripe/react-stripe-js";
import "./payment-form.css";

const PaymentForm = () => {

    const stripe = useStripe();
    const elements = useElements();

    const CARD_ELEMENT_OPTIONS = {
      style: {
        base: {
          color: "#32325d",
          fontSize: "16px",
          fontFamily: "Arial, sans-serif",
          fontSmoothing: "antialiased",
          "::placeholder": {
            color: "#aab7c4",
          },
          padding: "10px 12px",
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a",
        },
      },
    };

    const paymentHandler = async (e) => {

        e.preventDefault();

        if (!stripe || !elements){
            return;
        }

        //now we need to make requests to backend for payment intent
        fetch("http://localhost:5001/api/payments/create-payment-intent" , {
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({amount:1})
        }).
        then(res => res.json()).
        then(data => {
          console.log('data' , data);
          const clientSecret = data.client_secret;
          console.log('client secret' , clientSecret);


          return stripe.confirmCardPayment(clientSecret , {
            payment_method:{
              card:elements.getElement(CardNumberElement),
            }
          });
        }).
        then(result => {
          if (result.error){
            console.log('RES ERR:' , result.error.message);
          } else if (result.paymentIntent.status == "succeeded") {
            console.log("PAYMENT SUCCEEDED");
          }
        }).
        catch(err => console.log("error createing payment intent" , err.message));
    }

  return (
    <>
      <div>
          <form onSubmit={paymentHandler} style={{border:'1px solid gray' , width:'300px' , marginLeft:'auto' , marginRight:'auto' , padding:"10px 8px 15px 8px" , borderRadius:'12px'}}>
            <h2>Credit Card Payments</h2>
            
            <label>Card Number</label>
            <CardNumberElement options={CARD_ELEMENT_OPTIONS} />

            <label>Expiry</label>
            <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />

            <label>CVC</label>
            <CardCvcElement options={CARD_ELEMENT_OPTIONS} />

            <button type="submit" style={{padding:'5px 7px' , borderRadius:'8px' , backgroundColor:'navy' , color:'white'}}>PAY NOW</button>
          </form>
      </div>
    </>
  );
};

export default PaymentForm;
