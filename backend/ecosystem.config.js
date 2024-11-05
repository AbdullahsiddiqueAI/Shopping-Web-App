module.exports = {
    apps: [
        {
            name: "Django Server",
            script: "manage.py",
            args: "runserver 0.0.0.0:8000",  // Make sure Django listens on all interfaces
            interpreter: "python3",  // Use python3 interpreter
            cwd: "./backend",  // Path to the backend (Django)
            env: {
              PYTHON_ENV: "production",
            },
          },
      {
        name: "react-app",
        script: "npm",
        args: "run start",
        cwd: "/home/ubuntu/FYP/Client",
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  