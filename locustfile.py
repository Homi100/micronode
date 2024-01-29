from locust import HttpUser, between, task

class MyUser(HttpUser):
    wait_time = between(1, 3)  # Set the time range between tasks

    def on_start(self):
        # Perform login when the user starts
        self.login()

    def login(self):
        # Customize this method based on your website's login process
        response = self.client.post(
            "http://nuvexaphotos.com/api/user/login",  # Update with your login endpoint
            data={
                "email": "ahmadareeb15@gmail.com",
                "password": "12345"
            }
        )
        # Check if login was successful, you may need to customize this check
        if response.status_code == 200:
            print("Login successful")
        else:
            print("Login failed")

    @task
    def my_task(self):
        # Now you can perform your other tasks after logging in
        response = self.client.get("http://nuvexaphotos/api/usage/user/659193e69ff48d2e2a78f748")
        # Process the response or perform other tasks as needed
