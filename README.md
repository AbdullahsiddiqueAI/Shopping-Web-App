# Shopping Web App

## Overview
A shopping web application built with React (frontend) and Django (backend). The app provides a user-friendly interface for browsing products, managing a shopping cart, and placing orders. The backend handles user authentication, data storage, and API endpoints.

---

## Features
- **User Authentication:** Signup, login, and logout functionality.
- **Product Browsing:** View product listings with search and filter options.
- **Shopping Cart:** Add, update, or remove items in the cart.
- **Order Management:** Place orders and view order history.
- **Responsive Design:** Fully responsive UI for desktop and mobile devices.

---

## Technologies Used

### Frontend
- React
- Redux (for state management)
- React Router (for navigation)
- CSS
- React tanstack Query
### Backend
- Django
- Django REST Framework (DRF)
- PostgreSQL (or SQLite for development)

---

## Installation

### Prerequisites
- Python (3.8 or higher)
- Node.js (14 or higher)
- npm or Yarn
- PostgreSQL (if using a production database)

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/shopping-web-app.git
   cd shopping-web-app/backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate # On Windows use `venv\Scripts\activate`
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure the database:
   - Update `DATABASES` in `settings.py` with your PostgreSQL credentials.
   - Run migrations:
     ```bash
     python manage.py migrate
     ```

5. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

6. Run the server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the Client directory:
   ```bash
   cd ../Client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open the app in your browser:
   ```
   http://localhost:3000
   ```

---

## Usage
1. Open the app in your browser.
2. Sign up or log in to your account.
3. Browse products and add items to your cart.
4. Proceed to checkout to place an order.
5. View your order history in your profile.

---

## Deployment

### Backend (AWS or any cloud service)
- Use an AWS EC2 instance or similar to host the Django app.
- Configure Gunicorn and Nginx for production.
- Set up a PostgreSQL database.
- Use AWS S3 for static and media files.

### Frontend
- Deploy the React app using services like Netlify, Vercel, or AWS Amplify.
- Update the environment variables to match the production backend.

---

## Environment Variables

### Backend
- `SECRET_KEY`: Django secret key.
- `DEBUG`: Set to `False` in production.
- `DATABASE_URL`: Connection string for the database.
- `ALLOWED_HOSTS`: List of allowed domains.

### Frontend
- `VITE_BACKEND_END_POINT`: URL of the Django backend.

---

## Testing

### Backend
Run tests using Django's test framework:
```bash
python manage.py test
```

### Frontend
Run tests using Jest:
```bash
npm test
```

---

## Contributing
Contributions are welcome! Please fork the repository and create a pull request for any improvements or fixes.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.

---

## Acknowledgments
- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://reactjs.org/docs/)
- [Material-UI](https://mui.com/)

Feel free to reach out for questions or suggestions!

