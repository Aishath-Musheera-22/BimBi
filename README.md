# Bimbi – Recipe App

Bimbi is a **mobile recipe application** designed to help users explore, create, and enjoy a wide variety of recipes. It provides an intuitive interface for managing personal recipes, browsing community submissions, and organising cooking ideas through tags and user profiles.

---

## 🍽️ Features

### User Accounts
* Register a new account
* Log in and log out
* Update profile details, including **profile picture** and **display name**

### Recipe Management
* Add new recipes with:
    * **Title**
    * **Description**
    * **Ingredients**
    * **Instructions**
    * **Recipe image**
    * **Tags** (e.g., breakfast, dessert, dinner)
* View recently viewed recipes
* View and edit your own **recipe gallery**

### Explore
* Explore publicly posted recipes from all users
* Filter and browse recipes using predefined tags
* View detailed recipe pages

---

## 💻 Technology Stack

* **Expo Go** (for running the mobile application)
* **TypeScript** (.tsx files)
* **React Native** framework (via Expo)
* **AsyncStorage** (for saving local data, depending on implementation)
* **Expo Image Picker** (for selecting images)
* **Expo Linear Gradient** (for UI gradients)
* **react-native-dotenv** (for managing environment variables)

> **Note:** Expo uses React Native under the hood, so yes — you ARE using React Native even if you didn’t install it separately.

---

## 🚀 How to Run the App

1. Ensure **Node.js** and **npm** are installed.
2. Install Expo CLI (optional):
    ```bash
    npm install --global expo-cli
    ```
3. Install project dependencies:
    ```bash
    npm install
    ```
4. Install additional dependencies:
    ```bash
    npx expo install @react-native-async-storage/async-storage
    expo install expo-image-picker
    npx expo install expo-linear-gradient
    npm install react-native-dotenv
    ```
5. Start the development server:
    ```bash
    npx expo start
    ```
6. Scan the QR code using the **Expo Go** app on your phone.

---

## 📁 Project Structure (Short Overview)

* `/app` – Screens and navigation
* `/components` – Reusable UI components
* `/context` – User and recipe state management
* `/assets` – Images and static resources
* `App.tsx` – Entry point of the application

---

## 📝 User Testing

A separate **User Testing Document** has been completed, containing:
* Test cases
* Participant feedback
* Observed usability issues
* Final adjustments made to the app

This supports the evaluation of the app’s functionality and user experience.

---

## 💡 Future Improvements

* Add **search functionality**
* Allow **sorting** by cooking time or difficulty
* Add **personalised recommendations**
* Add **dark/light mode** settings
* Enable **in-app notifications** for new recipe updates

---

## 🧪 Usability Issues Identified

| Issue Identified            | User Feedback                                      | Proposed Solution                                           |
|-----------------------------|----------------------------------------------------|--------------------------------------------------------------|
| Edit icon too small         | “I didn’t notice the pencil icon at first.”       | Increase icon size and add a textual label.                 |
| No delete confirmation      | “I deleted a recipe by mistake.”                  | Add a confirmation modal before deletion.                   |
| Image upload feedback       | “I wasn’t sure if my image uploaded.”             | Show a progress indicator and confirmation message.         |
| Recently viewed resets      | “My recently viewed recipes disappear sometimes.” | Ensure state persists after app restarts.                   |


---

## 📸 Screenshots

> All screenshots are stored in the `/assets/images` folder.

### 🏠 Home Page
![Home Page](assets/images/homepage.jpg)

### 🍽️ Explore Page
![Explore Page](assets/images/explore%20page.jpg)

### ➕ Add Recipe
![Add Recipe](assets/images/add-recipe.jpg)

### 👤 Profile Page
![Profile Page](assets/images/profile%20page.jpg)

### 🔐 Login Page
![Login Page](assets/images/login%20page.jpg)

### 🆕 Register Page
![Register Page](assets/images/register%20page.jpg)

### 🚀 Splash Page
![Splash Page](assets/images/splash%20page.jpg)

### 📱 Main App Layout
![Main Layout](assets/images/main.jpg)

---

## ✅ Conclusion

Bimbi provides a simple and effective way to store, explore, and share recipes. With features for user profiles, tagging, browsing, and recipe creation, it offers a smooth experience for anyone looking to organise or discover new dishes.
