# Tradeling Voucher Pool Backend API
The voucher pool is a backend based solution intended to be integrated with an E-commerce website.
current feature provided by this solution is the ability to generate voucher/coupon for customers where they will be able to redeem this vouchers/coupons. Or generate a promotion codes that can be used by many customers based on predefined criteria (rules), for instance, allow redeeming the voucher based on customer list and/or items list and many other criteria. 


## Getting started

  
The code-base is made to run on Node.js runtime environment. It is based on Hapijs framework. Refer to [Hapijs](https://github.com/hapijs/hapi)

  
##### Development installation

```sh

$ npm install

$ npm run start-dev

```


##### Environment variables

```sh

COSMOS_DB_ENDPOINT=
COSMOS_DB_KEY=
COSMOS_DB_DATABASEID=

```
##### Documentation 
After cloning the and installing the dependencies please visit the [Docs](http://localhost:3001/documentation#/) 
  

### Directory structure

  

The codebase is based upon the [pal boilerplate](https://github.com/hapipal/boilerplate), which splits-up projects into two top-level directories: [`lib/`](lib) and [`server/`](server).

  

The `lib/` directory contains all the core functionality of the application. Strictly speaking, it constitutes a [hapi plugin](https://hapijs.com/tutorials/plugins), which is a portable and well-encapsulated way to articulate a web service. The sub-directories under `lib/` each define some pieces of the application: routes, models, services, other hapi plugins, etc. Most of the contents of `lib/` are picked-up automatically by pal's file-based hapi plugin composer [haute-couture](https://github.com/hapipal/haute-couture), and were scaffolded using the [hpal CLI](https://github.com/hapipal/hpal). Without haute-couture we would instead make many imperative calls to the hapi server interface; for example, we would call [`server.route()`](https://github.com/hapijs/hapi/tree/master/API.md#server.route()) rather than creating a file in `lib/routes/`, [`server.auth.strategy()`](https://github.com/hapijs/hapi/tree/master/API.md#server.auth.strategy()) rather than a file in `lib/auth/strategies/`, [`server.register()`](https://github.com/hapijs/hapi/tree/master/API.md#server.register()) rather than a file in `lib/plugins/`, etc.

  

The `server/` directory contains all configuration and code required to deploy the application. Given that `lib/` exports a hapi plugin, `server/` is primarily responsible to create a hapi server and register the app's plugin with some configuration provided by `server/.env`.

  

The reasoning behind this separation of `lib/` and `server/` is explained in detail in an article: [The joys of server / plugin separation](https://hapipal.com/best-practices/server-plugin-separation).

  

### The service layer

  


 
I endow  application with a service layer using the [schmervice](https://github.com/hapipal/schmervice) hapi plugin. Alongside the plugin, schmervice also ships with a base service class that provides some useful and convenient functionality, such as access to the hapi server and application configuration (plugin options), integration with the server's start/stop lifecycle, and the ability to leverage hapi's robust system for persistent caching.



### Routes

  
At the end of the day, we do all this work so that we can create some routes, or API endpoints. Each route consists of a [hapi route configuration](https://github.com/hapijs/hapi/blob/master/API.md#server.route()) placed as a file in [`lib/routes/`](lib/routes). These configurations provide information about the matching HTTP method and path; validation of incoming query, path, and payload parameters; authentication; and a handler or controller implementing the logic behind the route.


Validation is specified using hapi's robust [joi](https://github.com/hapijs/joi) validation library, which is the same means of validation used by our model layer. Since the routes and models use the same means of validation, routes are able to refer to the model's validation. For example, when a user logs-in the payload contains an `email` parameter that must be a valid email; in the route configuration we defer to the `User` model's definition of a valid email and mark it as a required field: [`User.field('email').required()`](lib/routes/users/signup.js#L16).
  


### Core
The way the special offers which are linked to voucher validated are based on npm packege called [Json-rules-engine](https://www.npmjs.com/package/json-rules-engine) where we can define a set of rules to be validated against the cart object sent from E-Comme system

### Area of Enhancement 
1- More unit testing to cover all possible edge cases 


2- Adding more routes such as ['GET /validation-rules/{id}'] | ['GET /redemption/{id}'] and many more depends on the need.


## How it works
1- First create new customer by using below endpoint (please refer to documention provided in [`http://localhost:3001/documentation#/`]
```sh

POST http://localhost:3001/customers

```




2- Generate a rule expression 



```sh

POST http://localhost:3001/validation-rules

use below payload as a sample : 

{
    "name": "Promotion Voucher Main",
    "conditions": {
        "all": [
            {
                "fact": "category",
                "operator": "equal",
                "value": "F&B",
                "params": {
                    "value": "F&B",
                    "error": {
                        "code": "itemRulesVoilated",
                        "message": "Items are not in correct category"
                    }
                }
            },
            {
                "fact": "totalItem",
                "operator": "equal",
                "value": 50,
                "params": {
                    "value": "F&B",
                    "error": {
                        "code": "itemsSubTotalRulesViolated",
                        "message": "Items subtotal is below 50"
                    }
                }
            }
        ]
    },
    "event": {
        "type": "addDiscount",
        "params": {
            "message": "Voucher %s applied successfully!"
        }
    }
}
```


3- generate a voucher

```sh
POST http://localhost:3001/vouchers

use below payload as a sample : 

{
    "name": "promotion voucher",
    "startDate": "2021-01-20T12:46:04Z",
    "endDate": "2021-10-22T12:46:05Z",
    "days": [],
    "status": "active",
    "customerEmail": <use the email generated form the first call>,
    "codeConfig": {
        "prefix": "PROMO-",
        "postfix": "-TR",
        "pattern": "#####"
    },
    "numberOfVouchers": 1,
    "numberOfUsagePerCustomer": 1,
    "numberOfUsage": 1,
    "ruleExpressionId": <use the ID generated from previous call >,
    "type": "DISCOUNT_VOUCHER",
    "discount": {
        "type": "PERCENTAGE",
        "value": 10,
        "maxAmount": 50
    }
}
```

4- Validate the voucher .
```sh

POST http://localhost:3001/campaigns/validation
Note: this call is consumed by e-comm checkout hence the checkout page should send the payload as below 

{
    "order": {
        "orderId": "ordernumber1234567",
        "createdAt": "2021-01-26",
        "customer": {
            "email": <use the email generated form the first call>,
            "metaData": {}
        },
        "isCustomerFirstOrder": true,
        "items": [
            {
                "itemId": "424441",
                "name": "coca cola",
                "sku": "string",
                "unitPrice": 2.5,
                "specialPrice": 2,
                "isScalableProduct": false,
                "quantity": 10,
                "category": "F&B",
                "brand": "SODA"
            },
            {
                "itemId": "424442",
                "name": "pepse",
                "sku": "string",
                "unitPrice": 5,
                "specialPrice": 3,
                "isScalableProduct": false,
                "quantity": 5,
                "category": "F&B",
                "brand": "SODA"
            }
        ],
        "subtotal": 50,
        "payment": {
            "method": "COD",
            "bin": "232651"
        }
    },
    "campaigns": [
        {
            "object": "voucher",
            "code": <Use voucher code generated from previous call >,
            "id": <Use voucher id generated from previous call >
        }
    ]
}
```

5- After the voucher is validated it is ready to be redeemed
```sh

POST http://localhost:3001/campaign/redemption
and use the same payload as in validation 

```
