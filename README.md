# **Web Stall: Architecture Design and Implementation**

### Tech Stack:

- HTML / CSS
- TypeScript

### This is a demonstration app built upon a carefully designed architecture, showcasing the development and implementation of a robust system using object-oriented TypeScript. It features a product catalog, shopping cart, and order processing system. <br> It demonstrates how to structure application architecture and develop the app with a focus on scalability and maintainability, embodying best practices in OOP design.

### Installation & Running the Project:

- **Clone the repository:**

`git clone <repository_url>`  
`cd <project_folder>`

- **Install dependencies:**

`npm install`

- **Start the development server:**

`npm run start`

---

**Architectural Style:** Event-driven.  
**Architectural Pattern:** MVP.  
**Presenter Interaction Pattern:** Event Broker.  
**Event Broker Pattern:** Observer.

**Component Layers**:

- Data Model Layer – responsible for retrieving, storing, and providing data. It generates events when data changes.

- View Layer – handles user-initiated events, generates events in response to user actions, and updates the UI based on data from the Data Model Layer.

- Interaction Layer – acts as a bridge between the Data Model and View layers, processing events and coordinating method calls between them.

## **Data Layer**

_**Structural Representation:**_

`src/components/model/...`

### **Classes in the Data Layer:**

- **AppData:** Responsible for storing the product list and providing methods for data processing.

  **Parameters:**

  - `events: IEvents` — instance of the event system.

  **Class Fields:**

  - `itemsList_: IItemData[]` — product list.
  - `item_: IItemData` — currently selected product.

  **Methods:**

  - `get itemsList(): IItemData[]` — returns the product list.
  - `get Item(): IItemData` — returns the current product.
  - `setItemList(items: IItemData[]): void` — updates the list of all products.
  - `setItem(item: IItemData): void` — updates the current product.
  - `isValid(itemIds: string[]): boolean` — checks for the presence of a product with a zero price.
  - `getPrice`: returns the product prices.

- **AppCart:** Handles cart management: adding, removing products, clearing the cart, and calculating the total cost.

  **Parameters:**

  - `events: IEvents` — instance of the event system.

  **Class Fields:**

  - `items: string[]` — object with the current cart state (list of products and total sum).

  **Methods:**

  - `isItemIn(item: IItemData): boolean` — checks if a product is in the cart.
  - `addItem(item: IItemData): void` — adds a product to the cart.
  - `removeItem(item: IItemData): void` — removes a product from the cart.
  - `clear(): void` — clears the cart.

- **AppCustomer:** Responsible for storing and managing customer data, as well as validation.

  **Parameters:**

  - `events: IEvents` — instance of the event system.

  **Class Fields:**

  - `customerData: ICustomerData` — object containing customer data.
  - `validationErrors: Partial<Record<keyof ICustomerData, string>>` — validation errors.

  **Methods:**

  - `setData(field: keyof ICustomerData, value: string): void` — updates customer data.
  - `setPayment(method: PaymentMethod): void` — saves the selected payment method.
  - `clear(): void` — clears customer data.
  - `validateForm(): boolean` — performs data validation.

### **View Layer**

_**Structural Representation:**_

`src/components/view/...`

**Classes in the View Layer:**

- **ViewModel:** A base abstract class. Provides core methods for interacting with UI elements.

  **Methods**:

  - `render(data?: Partial): HTMLElement` — updates the data and renders the container.
  - `toggleClass(element: HTMLElement, className: string, state?: boolean): void` — toggles the CSS class on an element.
  - `setTextContent(element: HTMLElement | null, value: unknown): void` — sets the text content of an element.
  - `setImage(element: HTMLImageElement, src: string, alt?: string): void` — updates an image element.
  - `setDisabled(element: HTMLElement, state: boolean): void` — toggles the disabled attribute of an element.

- **ViewMainPage**: Inherits from **ViewModel**. Represents the main page UI elements.

  **UI Elements**:

  - `page: HTMLElement` – main display container.
  - `pageGallery: HTMLElement` – container for product cards.
  - `cart: HTMLElement` – cart button.
  - `cartCounter: HTMLElement` – cart item counter.

  **Setters**:

  - `gallery(items: HTMLElement[]): void` – updates the product gallery.
  - `counter(index: number): void` – updates the cart item counter.
  - `scrollLocked(value: boolean): void` – locks or unlocks page scrolling.

- **ViewItemCard**: Inherits from **ViewModel**. Represents product card UI elements.

  **UI Elements**:

  - `itemTitle: HTMLElement` – product title/header.
  - `itemPrice: HTMLElement` – product price.
  - `itemCategory?: HTMLElement` – product category.
  - `itemImage?: HTMLImageElement` – product image.
  - `button_?: HTMLButtonElement` – add to cart button.
  - `itemDescription?: HTMLElement` – product description.
  - `indexInCart?: HTMLElement` – item index in the cart.

  **Setters**:

  - `title(value: string): void` – updates the product title.
  - `category(value: string): void` – updates the product category.
  - `image(value: string): void` – updates the product image.
  - `description(value: string): void` – updates the product description.
  - `price(value: number): void` – updates the product price.
  - `priceless(value: string): void` – displays a custom price message.
  - `button(value: string): void` – updates the button text.
  - `inCartStatus(value: string): void` – updates the cart button status.
  - `index(value: string): void` – updates the product index in the cart.

- **ViewCart**: Inherits from **ViewModel**. Represents the cart UI elements.

  **UI Elements**:

  - `cartList: HTMLElement` – list of items in the cart.
  - `cartTotal: HTMLElement` – total price of the cart.
  - `cartButton: HTMLButtonElement` – checkout button.

  **Setters**:

  - `items(items: HTMLElement[]): void` – updates the list of items in the cart.
  - `total(total: number): void` – updates the total price.
  - `priceless(value: string): void` – displays a custom message and disables the checkout button.

- **ViewOrderBase<Type>**: Inherits from **ViewModel**. Base class providing common methods for form elements.

  **UI Elements**:

  - `submitButton: HTMLButtonElement` – order confirmation button.
  - `errorField: HTMLElement` – error display field.

  **Setters**:

  - `valid(value: boolean): void` – enables/disables the submit button.
  - `errors(value: string): void` – updates the error field.

- **ViewOrderStepOne**: Inherits from **ViewOrderBase**. Represents the order form (customer details).

  **UI Elements**:

  - `cardButton: HTMLButtonElement` – card payment selection button.
  - `cashButton: HTMLButtonElement` – cash payment selection button.

  **Setters**:

  - `paymentCard(flag: boolean): void` – sets card payment method.
  - `paymentCash(flag: boolean): void` – sets cash payment method.
  - `paymentAll(flag: boolean): void` – manages both payment buttons.
  - `address(value: string): void` – updates the address field.

- **ViewOrderStepTwo**: Inherits from **ViewOrderBase**. Represents the order form (customer contacts).

  **UI Elements**:

  - `phone(value: string): void` – updates the phone field.
  - `email(value: string): void` – updates the email field.

- **ViewSuccess**: Displays the successful order completion page.

  **Setters**:

  - `total(total: number | string): void` – updates the text showing the amount charged.

- **ViewModalWindow**: Responsible for displaying a modal window.

  **Parameters**:

  - `events: IEvents` – event system instance.
  - `container: HTMLElement` – modal window container.

  **Methods**:

  - `set content(container: HTMLElement): void` – updates the modal window content.
  - `openModal(): void` – opens the modal window.
  - `closeModal(): void` – closes the modal window.
  - `render(content: Partial<IViewModalWindow>): HTMLElement` – renders content and opens the modal window.

## **Interaction Layer**

_**Structural Representation:**_

`src/index.ts`  
`src/common/...`

_**Description:**_

Interaction Layer components are presented in `index.ts` as the Presenter, an Event Broker in `events.ts`, and classes ensuring communication with the server.

The Event Broker provides methods for event generation, storage, and subscription.  
The Presenter instantiates core classes and, using the Broker, calls the necessary Data and View model methods when Events occur.

_**Main Event Broker Methods:**_

- `emit`: generates a notification about an Event and optionally passes data.
- `on`: receives an Event notification and calls a specified method, optionally passing received data as an argument.
- `off`: cancels an event subscription.

_**Events in the Application:**_

- `In the Data Model:`

  - Changes in the product list.
  - Changes in the cart data.
  - Changes in customer data.

- `In the View:`
  - Click on a product card.
  - Click on the cart button.
  - Click on the add/remove button in the product card.
  - Click on the remove button in the cart.
  - Click to proceed with the purchase.
  - Click to select a payment method.
  - Closing the modal window (click on the cross/background/new purchases).
  - Successful validation of cart state.
  - Successful form validation.
  - Successful purchase completion.

### **Classes**

### `Class: api`

Base abstract class providing methods for server interaction via HTTP requests such as `GET` and `POST`.

### `Class: AppApi`

Inherits from the `api` base class.  
Implements methods for interacting with the application server.

**Parameters:**

`cdn: string` – base URL for storing product images.  
`baseUrl: string` – base API URL.

**Class Fields:**

`cdn: string` – CDN URL for loading images.

**Methods:**

`getItemsList(): Promise<IItemData[]>` - fetches the product list from the server and adds the full image URL to each product.

Returns `Promise<IItemData[]>` – an array of product objects containing product information and the full image path.

`postOrder(order: IOrderData): Promise<IAppApiPostResponse>` - sends order data to the server.

Accepts `order: IOrderData` – object containing order details.

Returns: `Promise<IAppApiPostResponse>` – server response confirming the order.
