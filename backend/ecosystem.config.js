module.exports = {
    apps: [
        {
            name: "Django-Server",
            script: "manage.py",
            args: "runserver 0.0.0.0:8000",  
            interpreter: "python3",  
            cwd: "/home/ubuntu/FYP/backend",  
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
  