
import os
from flask import Flask, request, render_template, redirect, url_for
from flask_restful import Resource, Api, abort
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db_model import Base, Restaurant

app = Flask(__name__)
api = Api(app)
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:your_password@db:5432/restaurant_db')
# Create tables in the database if they do not exist
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(engine)
Base.metadata.bind = engine
# Create a session to interact with the database
Session = sessionmaker(bind=engine)
session = Session()
# Define resources for RESTful API
"""
    Handling all restaurant in the PostgreSQL in including : display and create.

    Methods:
        get():
            Retrieves a list of all restaurants from database.
        post():
            Creates a new restaurant and add to the database.
"""
class RestaurantList(Resource):
    def get(self):
        restaurants = session.query(Restaurant).all()
        return [restaurant.as_dict() for restaurant in restaurants]

    def post(self):
        data = request.get_json()
        new_restaurant = Restaurant(
            name=data['name'],
            location=data['location'],
            cuisine=data['cuisine'],
            rating=data['rating'],
            phone=data['phone'],
            email=data['email']
        )
        session.add(new_restaurant)
        session.commit()
        return new_restaurant.as_dict(), 201
"""
    Handling a signal restaurant including retrieve, update, and delete.

    Methods:
        get(restaurant_id):
            Retrieves details of a specific restaurant with given ID.
        put(restaurant_id):
            Updates details of a specific restaurant with given info.
        delete(restaurant_id):
            Deletes a specific restaurant with given ID.
"""
class RestaurantDetail(Resource):
    def get(self, restaurant_id):
        restaurant = session.query(Restaurant).get(restaurant_id)
        if restaurant is None:
            abort(404, message=f"Restaurant {restaurant_id} not found")
        return restaurant.as_dict()

    def put(self, restaurant_id):
        data = request.get_json()
        restaurant = session.query(Restaurant).get(restaurant_id)
        if restaurant is None:
            abort(404, message=f"Restaurant {restaurant_id} not found")
        restaurant.name = data.get('name', restaurant.name)
        restaurant.location = data.get('location', restaurant.location)
        restaurant.cuisine = data.get('cuisine', restaurant.cuisine)
        restaurant.rating = data.get('rating', restaurant.rating)
        restaurant.phone = data.get('phone', restaurant.phone)
        restaurant.email = data.get('email', restaurant.email)
        session.commit()
        return restaurant.as_dict()

    def delete(self, restaurant_id):
        restaurant = session.query(Restaurant).get(restaurant_id)
        if restaurant is None:
            abort(404, message=f"Restaurant {restaurant_id} not found")
        session.delete(restaurant)
        session.commit()
        return '', 204

"""
    Handling restaurant filtering based on location and/or cuisine.

    Methods:
        get():
            Retrieves a list of restaurants filtered by location and/or cuisine (3 conditons in total).

"""       
class RestaurantFilter(Resource):
    def get(self):
        location = request.args.get('location')
        cuisine = request.args.get('cuisine')

        query = session.query(Restaurant)

        if location and cuisine:
            # Filter by both location and cuisine
            restaurants = query.filter(Restaurant.location == location, Restaurant.cuisine == cuisine).all()
        if location:
            query = query.filter(Restaurant.location == location)
        if cuisine:
            query = query.filter(Restaurant.cuisine == cuisine)
        restaurants = query.all()

        return [restaurant.as_dict() for restaurant in restaurants]
"""
    Displaying all filter options (unique locations and cuisines) in the Drop-down menu provide a dynamic change.

    Methods:
        get():
            Retrieves a dictionary containing lists of unique locations and cuisines.
    """
class FilterOptions(Resource):
    def get(self):
        locations = session.query(Restaurant.location).distinct().all()
        cuisines = session.query(Restaurant.cuisine).distinct().all()

        return {
            'locations': [loc[0] for loc in locations],
            'cuisines': [cuisine[0] for cuisine in cuisines]
        }
    
# Add RESTful API endpoints
api.add_resource(RestaurantList, '/restaurants')
api.add_resource(RestaurantDetail, '/restaurants/<int:restaurant_id>')
api.add_resource(RestaurantFilter, '/restaurants/filter')
api.add_resource(FilterOptions, '/restaurants/filter-options')

"""
    Renders the main HTML template.
"""
@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
