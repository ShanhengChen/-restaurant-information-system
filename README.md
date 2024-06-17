# How to run this program with Docker

**Installation**
1. Build Docker image:
    ```bash
    docker build -t myapp .
    ```
2. Start the application and database services:
     ```bash
    docker-compose up
     
    ```
3. Access the application:
     ```bash
    Access in your browser: [http://localhost:5000](http://localhost:5000)
     
    ```
4. Stop and clean up all containers:
     ```bash
    docker-compose down
     
    ```

# Demo


https://github.com/ShanhengChen/-restaurant-information-system/assets/85982820/5590fa89-bfe3-4a6e-b817-e50f21002cdc


<br>
# Restaurant API Documentation

## Introduction

This API allows you to manage a list of restaurants, including retrieving details, adding new restaurants, updating existing ones, and filtering based on location and cuisine.

## Base URL

http://localhost:5000/

## Endpoints

### List All Restaurants

**Endpoint:** `/restaurants`

**Method:** `GET`

**Description:** Retrieve a list of all restaurants.

## Endpoints

### Add a New Restaurant

**Endpoint:** `/restaurants`

**Method:** `POST`

**Description:** Add a new restaurant.


## Get Restaurant Details

**Endpoint:** `/restaurants/<int:restaurant_id>`

**Method:** `GET`

**Description:** Retrieve details of a specific restaurant.

## Update Restaurant Details

**Endpoint:** `/restaurants/<int:restaurant_id>`

**Method:** `PUT`

**Description:** Update details of a specific restaurant.

## Delete a Restaurant

**Endpoint:** `/restaurants/<int:restaurant_id>`

**Method:** `DELETE`

**Description:** Delete a specific restaurant.

## Filter Restaurants

**Endpoint:** `/restaurants/filter`

**Method:** `GET`

**Description:** Filter restaurants by location and/or cuisine.

**Query Parameters:**
- `location` (optional): The location to filter restaurants by.
- `cuisine` (optional): The cuisine type to filter restaurants by.
- `location` and `cuisine` 


## Get Filter Options

**Endpoint:** `/restaurants/filter-options`

**Method:** `GET`

**Description:** Retrieve distinct locations and cuisines available for filtering.


## Models

### Restaurant Model

| Field    | Type   | Description                     |
|----------|--------|---------------------------------|
| id       | int    | Unique identifier for the restaurant. |
| name     | string | Name of the restaurant.         |
| location | string | Location of the restaurant.     |
| cuisine  | string | Type of cuisine the restaurant offers. |
| rating   | float  | Rating of the restaurant.       |
| phone    | string | Contact phone number.           |
| email    | string | Contact email address.          |

