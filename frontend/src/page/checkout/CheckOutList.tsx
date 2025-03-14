import React, { useState } from "react";

const CheckOutList = () => {
  const [selectedCountry, setSelectedCountry] = useState("Vietnam");
  const [states, setStates] = useState([
    "Yen Phong", "Ha Noi", "Ho Chi Minh City", "Da Nang", "Hai Phong"
  ]);

  const countries = {
    Vietnam: [
      "Yen Phong", "Ha Noi", "Ho Chi Minh City", "Da Nang", "Hai Phong"
    ],
    USA: [
      "California", "Texas", "New York", "Florida", "Illinois"
    ],
    UK: [
      "England", "Scotland", "Wales", "Northern Ireland"
    ],
    Canada: [
      "Ontario", "Quebec", "British Columbia", "Alberta"
    ],
    Australia: [
      "New South Wales", "Queensland", "Victoria", "Western Australia"
    ]
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setStates(countries[country] || []);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-8 bg-gray-100 min-h-screen">
      {/* Billing Details */}
      <div className="flex-1 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Billing details</h2>
        <form className="space-y-4">
          {/* First name and Last name */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First name *"
              className="input-style flex-1"
            />
            <input
              type="text"
              placeholder="Last name *"
              className="input-style flex-1 "
            />
          </div>

          {/* Other fields */}
          <input
            type="text"
            placeholder="Company name (optional)"
            className="input-style w-full"
          />
          
          {/* Dropdown for selecting country */}
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="input-style w-full"
          >
            <option value="Vietnam">Vietnam (VN)</option>
            <option value="USA">United States (US)</option>
            <option value="UK">United Kingdom (UK)</option>
            <option value="Canada">Canada (CA)</option>
            <option value="Australia">Australia (AU)</option>
          </select>

          {/* Dropdown for selecting State */}
          <select className="input-style w-full">
            {states.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="House number and street name *"
            className="input-style w-full"
          />
          <input
            type="text"
            placeholder="Apartment, suite, unit, etc. (optional)"
            className="input-style w-full"
          />
          <input
            type="text"
            placeholder="Town / City *"
            className="input-style w-full"
          />
          <input
            type="tel"
            placeholder="Phone *"
            className="input-style w-full"
          />
          <input
            type="email"
            placeholder="Email address *"
            className="input-style w-full"
          />

          {/* Create account and Ship to different address */}
          <div className="flex items-center gap-2">
            <input type="checkbox" id="createAccount" />
            <label htmlFor="createAccount">Create an account?</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="shipDifferent" />
            <label htmlFor="shipDifferent">Ship to a different address?</label>
          </div>

          {/* Order notes */}
          <textarea
            placeholder="Order notes (optional)"
            className="input-style h-20 w-full"
          ></textarea>
        </form>
      </div>

      {/* Order Summary */}
      <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your order</h2>
        <div className="border-b pb-4">
          <div className="flex justify-between mb-2">
            <span>Nike Air Jordan 1 Low - Panda</span>
            <span>$20</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Subtotal</span>
            <span>$20</span>
          </div>
        </div>
        <div className="py-4 border-b">
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>Flat rate: $5</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input type="radio" name="shipping" id="localPickup" />
            <label htmlFor="localPickup">Local pickup</label>
          </div>
        </div>
        <div className="py-4 border-b text-lg font-semibold">
          <div className="flex justify-between">
            <span>Total</span>
            <span>$45</span>
          </div>
        </div>
        <div className="py-4">
          <div className="flex items-center gap-2">
            <input type="radio" name="payment" id="bankTransfer" defaultChecked />
            <label htmlFor="bankTransfer">Direct Bank Transfer</label>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Make your payment directly into our bank account. Your order will
            not be shipped until the funds have cleared.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <input type="radio" name="payment" id="checkPayment" />
            <label htmlFor="checkPayment">Check Payments</label>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input type="radio" name="payment" id="cashOnDelivery" />
            <label htmlFor="cashOnDelivery">Cash On Delivery</label>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <input type="checkbox" id="terms" />
          <label htmlFor="terms">I have read and agree to the website terms and conditions</label>
        </div>
        <button className="w-full bg-purple-600 text-white py-3 mt-4 rounded-xl hover:bg-purple-700">
          Place order
        </button>
      </div>
    </div>
  );
};

export default CheckOutList;
