# FPL Dugout

FPL Dugout is a Fantasy Premier League (FPL) web app that allows users to track their FPL teams, leagues, and other relevant data seamlessly. The platform provides detailed insights into user teams, leagues, and transfers using the official Fantasy Premier League API.

## Features
- View FPL team details, including captain, vice-captain, and transfers.
- Track leagues and cups that a manager is part of.
- Retrieve detailed standings and statistics from any league.
- Future features include user authentication and additional FPL data endpoints.

## Tech Stack
- **Frontend:** Next.js, Redux Toolkit (for state management)
- **Backend:** Django, Django REST Framework
- **Database:** PostgreSQL
- **APIs:** Fantasy Premier League API

## Getting Started

First, clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/yourusername/fpl-dugout.git
cd fpl-dugout

# Install dependencies
npm install  # or yarn install
```

Run the development server:

```bash
npm run dev  # or yarn dev
```

The app will be available at `http://localhost:3000`.

## Backend Setup

Navigate to the backend directory and set up a virtual environment:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run Django migrations and start the server:

```bash
python manage.py migrate
python manage.py runserver
```

The backend will be available at `http://localhost:8000`.

## API Usage
FPL Dugout interacts with the Fantasy Premier League API. To retrieve a team's data, make a request to:

```bash
GET /api/entry/{team_id}/
```

## Learn More
To learn more about the technologies used:
- [Next.js Documentation](https://nextjs.org/docs)
- [Django Documentation](https://docs.djangoproject.com/en/stable/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Fantasy Premier League API](https://www.oliverlooney.com/blogs/FPL-APIs-Explained)

## Deployment
FPL Dugout will be deployed using Vercel for the frontend and Railway for the backend.


## Contributing
Contributions are welcome! Feel free to submit a pull request or open an issue for discussion.

## License
This project is licensed under the MIT License.

