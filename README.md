# Project Overview

This project is a web application built using Next.js, designed to visualize location data and risk scores using interactive charts and maps. The application fetches data from a backend API and displays it in a user-friendly interface.

## Getting Started

> **NOTE:** This repo depends on this [repo](https://github.com/EdroVolt/Kuyua-challenge-BE) as a backend.

> Make sure to add your own .env.local following the env.example

## 1. Using [Docker Compose](https://docs.docker.com/compose/) (Recommended)

- **first:** make sure you have [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/) installed on your machine.

- **Second:** Clone the repo

- **Third:** Open your terminal and make sure you are in the project root directory.

- **Forth:** Run the following command:

  ```bash
  docker-compose up --build
  ```

  > This command will run three containers, frontend, backend, and Mongodb database.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 2. Cloning the [backend repo](https://github.com/EdroVolt/listing-apartments) and this repo and running each one separately

## Approach

### 1. **Project Organization**
I tried to make it modular and split the code as possible in the required time-fame. 

### 2. **Data Fetching**
   - **Implementation**: Data is fetched from a backend API using Axios. The application uses React hooks (`useEffect` and `useState`) to manage data fetching and state.
   - **Reason**: This approach allows for a clean separation of concerns, where data fetching logic is encapsulated within the component, making it easier to manage and test.

### 4. **Component Structure**
   - **Implementation**: The application is structured into reusable components (e.g., `GlobeMap`, `Header`, `LocationsList`).
   - **Reason**: This modular approach promotes reusability and maintainability, making it easier to update or replace components as needed.

### 5. **Styling**
   - **Implementation**: CSS modules and global styles are used for styling the application.
   - **Reason**: This approach helps in scoping styles to specific components, preventing style conflicts and ensuring a consistent look and feel.

## Challenges Faced

1. **Data Handling**: Managing asynchronous data fetching and ensuring that the UI updates correctly based on the fetched data was initially challenging.
   - **Solution**: Implemented loading states and error handling to improve user experience during data fetching.

2. **Map Integration**: Integrating Mapbox and ensuring that markers were displayed correctly based on user location was complex.
   - **Solution**: Created helper functions to calculate distances and filter locations based on proximity to the user's geolocation.

## Improvements for the Future

1. **Enhanced Error Handling**: Implement more robust error handling and user feedback mechanisms to improve the user experience during data fetching failures.

2. **Performance Optimization**: Investigate and implement performance optimizations, such as code splitting and lazy loading of components, to improve load times.

3. **Testing**: Implement unit and integration tests to ensure the reliability of components and data fetching logic.

4. **Accessibility Improvements**: Further enhance accessibility features to ensure that the application is usable for all users, including those with disabilities.

4. **Design / Styling**: Mimic the provided style.
