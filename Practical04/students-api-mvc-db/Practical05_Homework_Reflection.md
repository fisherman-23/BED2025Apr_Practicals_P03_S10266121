### Task 2: Reflection and Review

Reflect on your learning journey from Practical 03 to Practical 05, focusing on the evolution of your API project structure, robustness, and the separation of concerns.

1.  **Separation of Concerns:**

    - In your own words, explain the distinct responsibilities of the Model, View (the external frontend), and Controller in your final project structure.
      The model is responsible for handling the data layer and the business logic. It interacts with the database. It has code to interact directly with the database, CRUD operations,
      via for example. SQL statements and requests.
      The view handles the user interface and presentation layer. It is a separate frontend part that interacts with the backend (controller and model) via APIs. It gathers user input and
      provides smooth visual experience, renders data received by the controller.
      The controller is a intermediary between the view and the model. It processes incoming API requests from the view, and calls the appropriate functions in the model. It also manages routing, validation and error handling at the API level.

    - How does having a separate frontend View (Practical 05) simplify the responsibilities of your backend API?
      With the frontend View separated, the backend API no longer needs to manage HTML rendering or user interface concerns. Instead, the backend focuses solely on processing data, applying business logic, validating requests, and returning clean, standardized JSON responses

2.  **Robustness and Security:**

    - Consider the journey from a simple API (Practical 03) to a more robust one (Practical 04) and a full-stack application (Practical 05). At which stage do you think it became easier to identify and fix bugs related to data handling or API responses? Why?
      It became easier to identify and fix bugs during Practical 04, when the API was made more robust, thorough validation, structured error handling, and better separation of concerns. The introduction of well-defined input validation and standardized API responses allowed for clearer error messages when things went wrong.
      In Practical 03, the API was simpler and less structured, making debugging more difficult because errors might not have been caught or reported clearly. Practical 05’s full-stack setup also improved bug detection because the frontend could catch and display error messages more effectively.

3.  **Challenges and Problem Solving:**

    - What was the most challenging aspect for you across Practical 03, 04, and 05? Describe the problem and how you approached solving it.
      One of the most challenging parts was implementing validation and error handling correctly while maintaining clean code separation. Initially, in Practical 03, the API was simple and had minimal validation, which led to silent failures or inconsistent behavior. I think another aspect was separating the concerns, from one big file, to a MVC like setup, had to sift a messy initial codebase.

    - Thinking critically, if you had to add a new feature (e.g., adding a "genre" field to books, or implementing user authentication), how would the current MVC structure with a separate View layer help you approach this task in a more organized and efficient way compared to the initial Practical 03 structure?
      I would just update the existing functions in Model to handle the new genre field, then update the View to show the new field. Compared to Practical03, i would be filtering through the code
      trying to find out what needs to be changed. So it is more efficient with the MVC architecture setup and proper separation of concerns.

4.  **Experiential Learning:** How did the hands-on coding and refactoring in these practicals help you understand the concepts of MVC, validation, error handling, and parameterized queries compared to just reading about them?
    I find the slow progression from Practical03, where it is all in one file, very messy with no separation of concerns, to Practical05, with proper MVC architecture setup and a proper frontend, quite helpful in helping me understand the concepts, and why it is helpful. I also liked how the practicals started with the Books example as a guided tutorial, then made us try it out individually, and put our skills to practice using the Students example.
