module.exports = {
    apps: [
        {
            name: "Django Server",
            script: "manage.py",
            args: "runserver",
            interpreter: "python",
            cwd: "./backend",
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
  