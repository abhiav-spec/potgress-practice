# payment-gateway-practice

Folder structure only. No implementation code yet.
1. Clone repo only once
   git clone <repo-url>

2. Move into project
   cd project-name

3. Before starting any task:
   git checkout main
   git pull origin main

4. Never work directly on main branch

5. Create your own branch for every task
   git checkout -b feature/task-name

6. Complete your work in that branch

7. Check changed files
   git status

8. Add files
   git add .

9. Commit changes with proper message
   git commit -m "Added login feature"

10. Push your branch
   git push origin feature/task-name

11. Create Pull Request (PR) on GitHub

12. After task completion:
   switch back to main
   pull latest changes again before new task


# 🚀 Complete Payment Flow Architecture

Your payment system now works like this:

```text id="pf1"
Frontend
↓
payment.controller.js
↓
payment.service.js
↓
razorpay.service.js
↓
Razorpay Server
↓
transaction.model.js
↓
PostgreSQL Database
```

---

# 🧠 Step-by-Step Flow

---

# 🔥 STEP 1 — User Clicks Pay

Frontend sends:

```http id="pf2"
POST /api/payment/create-order
```

Body:

```json id="pf3"
{
  "user_id": 1,
  "amount": 500
}
```

---

# 🔥 STEP 2 — `payment.controller.js`

Controller receives request.

Function:

```js id="pf4"
createOrder()
```

Its job:

# request-response handling

It:

* gets data from frontend
* calls services
* sends response back

---

# 🔥 STEP 3 — `payment.service.js`

Controller calls:

```js id="pf5"
createRazorpayOrder(amount)
```

Purpose:

# business/payment logic

It:

* prepares payment options
* manages payment flow

Example:

```js id="pf6"
const options = {
  amount: amount * 100,
  currency: "INR"
}
```

---

# 🔥 STEP 4 — `razorpay.service.js`

Now service calls:

```js id="pf7"
createOrder(options)
```

Purpose:

# direct Razorpay SDK communication

This file ONLY talks to Razorpay.

Example:

```js id="pf8"
razorpay.orders.create(options)
```

---

# 🔥 STEP 5 — Razorpay Creates Order

Razorpay returns:

```json id="pf9"
{
  "id": "order_xyz",
  "amount": 50000
}
```

This is:

# order JSON/object

---

# 🔥 STEP 6 — Save Transaction

Back in controller:

```js id="pf10"
createTransaction({
  status: "initiated"
})
```

DB stores:

| status    | meaning         |
| --------- | --------------- |
| initiated | payment started |

---

# 🔥 STEP 7 — Response Sent To Frontend

Controller sends:

```json id="pf11"
{
  "order": {
    "id": "order_xyz"
  }
}
```

Frontend now gets:

# order.id

---

# 🔥 STEP 8 — Frontend Opens Razorpay Checkout

Frontend uses:

```js id="pf12"
order_id: order.id
```

Razorpay popup opens.

User pays.

---

# 🔥 STEP 9 — Razorpay Returns Payment Data

After success:

```json id="pf13"
{
  "razorpay_order_id": "...",
  "razorpay_payment_id": "...",
  "razorpay_signature": "..."
}
```

Frontend sends this to backend:

```http id="pf14"
POST /api/payment/verify
```

---

# 🔥 STEP 10 — `verifyPayment()` Controller

Controller receives payment data.

Purpose:

# verify authenticity

---

# 🔥 STEP 11 — `payment.service.js`

Calls:

```js id="pf15"
verifyPaymentSignature()
```

---

# 🔥 STEP 12 — `razorpay.service.js`

This file:

# cryptographically verifies signature

using:

```js id="pf16"
crypto.createHmac(...)
```

Checks:

# payment genuinely came from Razorpay

---

# 🔥 STEP 13 — Update Transaction Status

If valid:

```text id="pf17"
status = success
```

If invalid:

```text id="pf18"
status = failed
```

Database updated.

---

# 🔥 STEP 14 — Final Response

Backend sends:

```json id="pf19"
{
  "message": "Payment verified successfully"
}
```

---

# 🧠 Responsibility of Each File

| File                    | Responsibility                  |
| ----------------------- | ------------------------------- |
| `payment.controller.js` | request-response handling       |
| `payment.service.js`    | payment business logic          |
| `razorpay.service.js`   | Razorpay SDK operations         |
| `transaction.model.js`  | database operations             |
| `PostgreSQL`            | stores payment/transaction data |

---

# 🎯 Final Understanding

---

# `Controller`

Handles:

```text id="pf20"
HTTP request/response
```

---

# `payment.service`

Handles:

```text id="pf21"
payment business logic
```

---

# `razorpay.service`

Handles:

```text id="pf22"
actual Razorpay communication
```

---

# `transaction.model`

Handles:

```text id="pf23"
database queries/storage
```

---

# 🚀 Overall

Your backend now has:

# professional layered payment architecture.

