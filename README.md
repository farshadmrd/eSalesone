# eSalesone

The eSalesOne project is a modern, Angular-based web application designed to showcase and sell web development services on behalf of esalesone Company. Built with Angular 19, this three-page “mini store” functions both as a professional portfolio and a simple e-commerce experience, allowing potential clients to browse service offerings, add them to a cart, and submit a mock order. Below is a concise summary of the project’s purpose, features, design choices, and technical implementation.


## Website Design
For this website’s design and functionality, I drew inspiration from several “shots” (visual examples and components). You can explore the specific references I used by visiting this link:
https://www.figma.com/design/aIA6FFrsRe2Fawv4yiFwfe/eCommerce?node-id=0-1&t=A8vPlW4RJNSM4Bw8-1

I went with a dark theme because I think it looks more modern and professional. The background is black with light gray text, and I use red highlights to make important stuff stand out. I'm using the Sansita font throughout because it feels clean and friendly.

## What it does

This is basically a mini online store where potential clients can browse my services and place orders. It's got three main pages:

**Home page**  
This is where people land first. There's an intro section about me, my background, and a gallery showing the different services I offer with pricing. Each service has its own card that you can click to add to your cart.

**Checkout page**  
Once someone decides they want to hire me, they go here to fill out their information and "pay" (it's just a demo, no real payments). The form asks for their name, email, phone, address, and credit card details. Everything has validation so you can't submit incomplete info.

**Thank you page**  
After completing checkout, users are redirected to a confirmation page that shows their order status. The page displays different content based on the order result:
- **Approved**: Shows order confirmation, details, and next steps
- **Declined**: Displays payment decline reasons and retry options  
- **Failed**: Shows technical error information and support contacts


## How I built it

I used Angular 19 for this project. The shopping cart uses a service that saves items to `localStorage` so if someone refreshes the page, their selections don't disappear.

For the forms, I'm using Angular's reactive forms with real-time validation—so if you type an invalid email, it tells you right away instead of waiting until you submit.

The navigation is kind of hybrid: on the home page it scrolls to different sections, but the checkout is actually a separate page you navigate to.


### Prerequisites
- Node.js (version 18 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   ng serve
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:4200/
   ```

The application will automatically reload if you change any of the source files.

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
