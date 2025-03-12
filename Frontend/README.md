# AI-Powered Checkout/POS Frontend

## Stack

* React, Next.js, Vercel
* React Native, Expo *(mobile application now deprecated)*

## Screenshots

<div style="display: flex; justify-content: space-between;">
  <img src="./../asset/5.png" width="48%">
  <img src="./../asset/6.png" width="48%">
</div>
<br>
<div style="display: flex; justify-content: space-between;">
  <img src="./../asset/7.png" width="48%">
  <img src="./../asset/8.png" width="48%">
</div>
<br>
<div style="display: flex; justify-content: space-between;">
  <img src="./../asset/9.png" width="48%">
  <img src="./../asset/10.png" width="48%">
</div>
<br>
<div style="display: flex; justify-content: space-between;">
  <img src="./../asset/11.png" width="48%">
  <img src="./../asset/12.png" width="48%">
</div>

## Architecture

### Overview
  
```mermaid
sequenceDiagram
    participant User
    participant Frontend (React/Next.js)
    participant Firebase Auth
    participant Firebase DB (Sales & Inventory)
    participant Backend Server
    participant Julius AI
    participant ImgBB File Server

    %% User Authentication
    User ->> Frontend (React/Next.js): Login Credentials
    Frontend (React/Next.js) ->> Firebase Auth: Authenticate User
    Firebase Auth -->> Frontend (React/Next.js): Auth Response
    Frontend (React/Next.js) -->> User: Login Success/Error

    %% CRUD Operations on Sales & Inventory
    User ->> Frontend (React/Next.js): Perform Sales & Inventory CRUD operations
    Frontend (React/Next.js) ->> Firebase DB (Sales & Inventory): CRUD Requests
    Firebase DB (Sales & Inventory) -->> Frontend (React/Next.js): CRUD Responses

    %% Scheduled Data Analysis Process
    loop Scheduled Interval
        Backend Server ->> Firebase DB (Sales & Inventory): Pull Sales & Inventory Data
        Firebase DB (Sales & Inventory) -->> Backend Server: Return Data
        
        Backend Server ->> Julius AI: Send Data for Analysis
        Julius AI -->> Backend Server: Return Analyzed Data
        
        Backend Server ->> ImgBB File Server: Upload Analyzed Data Images
        ImgBB File Server -->> Backend Server: Return Image URLs
        
        Backend Server ->> Firebase DB (Sales & Inventory): Store Image URLs for Analytics
    end

    %% Rendering Analytics on Frontend
    Frontend (React/Next.js) ->> Firebase DB (Sales & Inventory): Request Analytics Image URLs
    Firebase DB (Sales & Inventory) -->> Frontend (React/Next.js): Return Image URLs
    
    Frontend (React/Next.js) -->> User: Render Analytics Data Visualizations
```

### DB 

Firebase *(real-time database)* follows the below schema.

```txt
/users/
  /$userId/
    /metadata/
      createdAt: timestamp
      lastLogin: timestamp
      settings/
        businessName: string
        currency: string
        taxRate: number
        address: string
        phone: string
        email: string
        receiptFooter: string
    
    /inventory/
      /$itemId/
        id: string
        name: string
        price: number
        quantity: number
        category: string
        sku: string
        createdAt: timestamp
        updatedAt: timestamp
    
    /sales/
      /$saleId/
        id: string
        items: [
          {
            itemId: string
            name: string
            price: number
            quantity: number
          }
        ]
        total: number
        paymentMethod: string
        createdAt: timestamp

    /analytics/ 
        images: {
           image1: string,
           image2: string,
           ...
         }
```



## Local usage

For debugging purposes.

### Web application

Add Firebase secrets within a `.env.local`.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=???
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=???
NEXT_PUBLIC_FIREBASE_DATABASE_URL=???
NEXT_PUBLIC_FIREBASE_PROJECT_ID=???
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=???
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=???
NEXT_PUBLIC_FIREBASE_APP_ID=???
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=???
```

Then run the below.

```console
$ cd reworked-yipee/yipee-org
$ npm install firebase date-fns recharts lucide-react
$ npm run dev
```

View the site at [http://localhost:3000](http://localhost:3000).