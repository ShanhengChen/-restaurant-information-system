document.addEventListener('DOMContentLoaded', function() {
    const restaurantList = document.getElementById('restaurantList');
    const locationFilter = document.getElementById('locationFilter');
    const cuisineFilter = document.getElementById('cuisineFilter');
    const showAddFormBtn = document.getElementById('showAddFormBtn');
    const addForm = document.getElementById('addForm');
    const updateForm = document.getElementById('updateForm');
    const cancelAddBtn = document.getElementById('cancelAddBtn');
    const cancelUpdateBtn = document.getElementById('cancelUpdateBtn');

    // display all Restaurant in the sql when page loaded
    loadRestaurants();
    // load all possible opions for location and cuisine in the dropdown menu
    loadFilterOptions(); 

    // when add Show Restaurant bottun show Add Restaurant Form hide others
    // and reset Add Restaurant Form into blank form 
    showAddFormBtn.addEventListener('click', function() {
        addForm.classList.remove('hidden');
        updateForm.classList.add('hidden');
        restaurantList.classList.add('hidden');
        showAddFormBtn.classList.add('hidden');
        clearAddForm();
    });

    // add buttun for Add Restaurant Form submission to add new restaurant 
    addForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(addForm);
        // Fetch POST request to '/restaurants' endpoint
        fetch('/restaurants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData))
        })
        .then(response => response.json())
        .then(newRestaurant => {
            loadRestaurants(); // reflash the Restaurant list after adding new restaurant
            addForm.classList.add('hidden');
            restaurantList.classList.remove('hidden');
            showAddFormBtn.classList.remove('hidden');
        })
        .catch(error => console.error('Error:', error));
    });

    // canceling Add operation would can
    cancelAddBtn.addEventListener('click', function() {
        addForm.classList.add('hidden');
        restaurantList.classList.remove('hidden');
        showAddFormBtn.classList.remove('hidden');
    });

    // Function to clear Add Restaurant Form
    function clearAddForm() {
        addForm.reset();
    }

    // update restaurant through update form submit button
    updateForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(updateForm);
        const restaurantId = formData.get('id');
        // Fetch PUT request to '/restaurants/${restaurantId}' endpoint
        fetch(`/restaurants/${restaurantId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData))
        })
        .then(response => response.json())
        .then(updatedRestaurant => {
            loadRestaurants(); 
            updateForm.classList.add('hidden');
            restaurantList.classList.remove('hidden');
            showAddFormBtn.classList.remove('hidden');
        })
        .catch(error => console.error('Error:', error));
    });

    // Event listener for canceling Update operation
    cancelUpdateBtn.addEventListener('click', function() {
        updateForm.classList.add('hidden');
        restaurantList.classList.remove('hidden');
        showAddFormBtn.classList.remove('hidden');
    });

    // Event listener for Location filter
    locationFilter.addEventListener('change', function() {
        const location = this.value;
        const cuisine = cuisineFilter.value; // get current cusine value
        if (location || cuisine) {
            filterRestaurants({ location, cuisine });
        } else {
            loadRestaurants(); //if no option load all Restaurants
        }
    });

    // Event listener for Cuisine filter
    cuisineFilter.addEventListener('change', function() {
        const location = locationFilter.value; // get current location value
        const cuisine = this.value;
        if (location || cuisine) {
            filterRestaurants({ location, cuisine });
        } else {
            loadRestaurants(); //if no option load all Restaurants
        }
    });

    //fetches a list of restaurants from the backend server at the /restaurants endpoint.
    function loadRestaurants() {
        fetch('/restaurants')
        .then(response => response.json())
        .then(restaurants => {
            renderRestaurants(restaurants); 
        })
        .catch(error => console.error('Error:', error));
    }

    // Function to load filter options (Location and Cuisine)
    function loadFilterOptions() {
        //fetches filter options from the backend server at the /restaurants/filter-options endpoint.
        fetch('/restaurants/filter-options')
        .then(response => response.json())
        .then(options => {
            populateFilterOptions(options); 
        })
        .catch(error => console.error('Error:', error));
    }

    // Function to populate Location and Cuisine filter options
    function populateFilterOptions(options) {
        populateSelect(locationFilter, options.locations);
        populateSelect(cuisineFilter, options.cuisines);
    }

    // Helper function to populate a <select> element with options
    function populateSelect(selectElement, options) {
        selectElement.innerHTML = '<option value="">Select</option>'; // add default value
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            selectElement.appendChild(optionElement);
        });
    }

    // Function to render restaurants
    function renderRestaurants(restaurants) {
        restaurantList.innerHTML = ''; // make sure innerhtml is null before assign
        restaurants.forEach(restaurant => {
            const restaurantDiv = document.createElement('div');
            restaurantDiv.classList.add('restaurant');
            restaurantDiv.innerHTML = `
                <div class="restaurant-info">
                    <p><strong>Name:</strong> ${restaurant.name}</p>
                    <p><strong>Location:</strong> ${restaurant.location}</p>
                    <p><strong>Cuisine:</strong> ${restaurant.cuisine}</p>
                    <p><strong>Phone:</strong> ${restaurant.phone}</p>
                </div>
                <div class="restaurant-buttons">
                    <button onclick="getRestaurant(${restaurant.id})">Details</button>
                    <button onclick="populateUpdateForm(${restaurant.id})">Update</button>
                    <button onclick="deleteRestaurant(${restaurant.id})">Delete</button>
                </div>
            `;
    
            restaurantList.appendChild(restaurantDiv);
        });
    }
    
    // Function to filter restaurants based on location or cuisine
    function filterRestaurants(filters) {
        const url = '/restaurants/filter?' + new URLSearchParams(filters).toString();

        fetch(url)
        .then(response => response.json())
        .then(filteredRestaurants => {
            renderRestaurants(filteredRestaurants); // display all suitable Restaurants
        })
        .catch(error => console.error('Error:', error));
    }

    // Function to get detailed information of a specific restaurant
    window.getRestaurant = function(id) {
        // sends a GET request to /restaurants/${id} endpoint.
        fetch(`/restaurants/${id}`)
        .then(response => response.json())
        .then(restaurant => {
            alert(`
                Name: ${restaurant.name}
                Location: ${restaurant.location}
                Cuisine: ${restaurant.cuisine}
                Rating: ${restaurant.rating}
                Phone: ${restaurant.phone}
                Email: ${restaurant.email}
            `);
        })
        .catch(error => console.error('Error:', error));
    }

    // Function to delete a restaurant
    window.deleteRestaurant = function(id) {
        if (confirm('Are you sure you want to delete this restaurant?')) {
            //ends a DELETE request to /restaurants/${id} endpoint also create a confirm (only click yes may delet the restaurants)
            fetch(`/restaurants/${id}`, {
                method: 'DELETE'
            })
            .then(() => {
                loadRestaurants(); // reflash all Restaurants after deleting one 
            })
            .catch(error => console.error('Error:', error));
        }
    }

    // Function to populate update form with restaurant data
    window.populateUpdateForm = function(id) {
        //sends a GET request to /restaurants/${id} endpoint and recevie all info of a restaurant with given id
        fetch(`/restaurants/${id}`)
        .then(response => response.json())
        .then(restaurant => {
            updateForm.classList.remove('hidden');
            addForm.classList.add('hidden');
            restaurantList.classList.add('hidden');
            showAddFormBtn.classList.add('hidden');

            document.getElementById('updateId').value = restaurant.id;
            document.getElementById('updateName').value = restaurant.name;
            document.getElementById('updateLocation').value = restaurant.location;
            document.getElementById('updateCuisine').value = restaurant.cuisine;
            document.getElementById('updateRating').value = restaurant.rating;
            document.getElementById('updatePhone').value = restaurant.phone;
            document.getElementById('updateEmail').value = restaurant.email;
        })
        .catch(error => console.error('Error:', error));
    }
});
