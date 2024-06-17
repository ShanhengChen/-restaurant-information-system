from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
"""
    A restaurant database model.

    Attributes:
        id (int): The unique identifier for the restaurant 
        name (str): The name of the restaurant.
        location (str): The location of the restaurant.
        cuisine (str): The type of cuisine served at the restaurant.
        rating (float): The rating of the restaurant.
        phone (str): The contact phone number of the restaurant
        email (str): The contact email of the restaurant 

    Methods:
        as_dict():
            Returns the restaurant's attributes as a dictionary.
"""
class Restaurant(Base):
    
    __tablename__ = 'restaurants'
    id = Column(Integer, primary_key=True)
    name = Column(String(80), nullable=False)
    location = Column(String(120), nullable=False)
    cuisine = Column(String(50), nullable=False)
    rating = Column(Float, nullable=False)
    phone = Column(String(20))
    email = Column(String(50))

    def as_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'cuisine': self.cuisine,
            'rating': self.rating,
            'phone': self.phone,
            'email': self.email
        }
