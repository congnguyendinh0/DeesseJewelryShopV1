Here’s a structured and comprehensive README for your Shopify development store project:

---

# Deesse Jewelry Development Store

This project is a development store created for  to test and potentially sell jewelry, built using Shopify and Hydrogen. It is based on the Hydrogen quickstart starter.

#Demo
![Preview of store](public/images/screen.png)
[Demo](https://youtu.be/EtP8sIiCNoo)

## Table of Contents
- [Features for Shoppers](#features-for-shoppers)
- [Features for Sellers](#features-for-sellers)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Testing](#testing)
- [Conclusion](#conclusion)

## Features for Shoppers
When shoppers visit the store, they are welcomed by a user-friendly homepage. Here are some key features:

- **Cookie Preferences**: Shoppers are prompted to set their cookie preferences on their first visit.
- **Navigation**: The navigation bar includes “Catalog” and “Collections” on the left, with “Person,” “Search,” and “Cart” buttons on the right, implemented using the `fa-icons` React package and Radix.
- **Product Browsing**: Shoppers can explore all products in the catalog and view collections categorized by type (e.g., rings, necklaces).
- **Cover Banner**: A component highlighting featured and recent collections, utilizing a GraphQL query to pull collections from the shop.
- **Call-to-Action**: A “Shop Now” button encourages shoppers to explore products.
- **Product Grid**: A grid displays recommended products and the latest blog articles.
- **Discount Codes**: A 10% discount code “meow” is available for specific products, along with free shipping for orders over €39.99.
- **User Accounts**: Optional login feature to enhance the shopping experience for repeat customers.
- **Order Confirmation**: Shoppers receive an email detailing their purchased products after a successful order.
- **Footer Links**: Links to social media channels and policies, along with a FAQ component.

When users click on a product, they are redirected to a detailed product page that includes a description and a purchase button. Each collection is displayed with an image and its name on top.

## Features for Sellers
As the seller, I have access to various functionalities through the Shopify admin platform:

- **Product Management**: Edit products, create new listings, and manage collections and inventory.
- **Order Monitoring**: View and manage all orders and customers.
- **GraphQL Integration**: Option to create products using GraphQL, though I prefer the user-friendly web interface.
- **Real-Time Updates**: Changes made on the platform appear immediately in the local app.
- **Shipping Options**: Configuration of shipping and delivery options for specific markets (e.g., Germany).
- **Privacy Settings**: Established customer privacy settings and cookie policies.
- **App Integrations**: Installed apps including Online Store, Headless, Hydrogen, and Sanity Connect.

## Technologies Used
- **Shopify**: E-commerce platform.
- **Hydrogen**: Framework for building custom storefronts.
- **GraphQL**: For querying data.
- **React**: JavaScript library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Ngrok**: For local testing and tunneling.
- **Sanity**: Headless CMS for content management.

## Setup Instructions
1. Clone this repository to your local machine / set up necessary .env.
2. Navigate to the project directory.
3. Install the necessary dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Access the store at `http://localhost:3000`.

## Testing
For testing, I integrated Shopify’s Bogus Gateway to simulate transactions. Ensure to test all features, including cookie preferences, product browsing, and checkout processes.

## Conclusion
Overall, I am quite pleased with the functionality of the shop. While I encountered challenges, particularly with Hydrogen's documentation and learning multiple technologies, the project was a valuable learning experience. I significantly improved my GraphQL skills and successfully connected the shop to Sanity.

--- 

Feel free to modify any sections to better fit your style or add any additional details you think are important!