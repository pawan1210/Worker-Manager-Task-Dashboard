# Worker-Manager-Dashboard
Hosted Link - https://task-dashboard-wm.herokuapp.com/

 ### MANAGER

- Able to login/signup with email and password.
- Able to post/edit the tasks (with details), set estimated time to complete the full task(minute, hour, days) and the points(1-500) to be rewarded for the task on completion.
- Able to view the task submitted by the user and rate the task. (Rewards to be - assigned to users if a task is approved).
- Able to view the tasks assigned/pending/rejected/approved on using a date filter.
- Download the files attached by the worker for his/her task.

### Worker

- Able to login with email and password.
- Able to view the tasks posted by any manager. (paginated tasks).
- Submit the task either with text solution or images or docs.
- Able to search the task using status and date filter.
- Able to view/edit his profile details.
- Able to view the completed task history (paginated) and the total rewards.


### API - LIST
#### - Auth
1. "/login"
    ```
    {
        "email":"",
        "password":""
    }
    ```
2. "/register"
    ```
    {
        "access":"manager/worker",
        "name":"",
        "email":"",
        "phone":"",
        "password":"",
    }
    ```
#### - Task 
1. "/task" ( method = "GET")
    Render task model.
2. "/task" (method = "POST")
    ```
    {
        "name":"",
        "description":"",
    }
    ```
3. "/task/:task_id" (method = "GET")
    Render edit task model.

4. "/task/:task_id" (method = "PUT")
    ```
    {
        "name":"",
        "description":"",
    }
    ```
5. "/task/:task_id/assign" (method = "GET")
    Render assign task model.
6. "/task/:task_id/assign" (method = "POST")
    ```
    {
        "worker_id":"id of worker",
        "maximum_points":"",
        "deadline":""
    }
    ```
7. "/task/:task_id/submit" (method = "GET")
    Render submit task model.
8. "/task/:task_id/submit" (method = "POST")
    ```
    {
        "text":"",
        "file":""
    }
    ```
9. "/task/:task_id/review" (method = "GET")
    Render review task model.

10. "/task/:task_id/review" (method = "POST")
    ```
    {
        "status":"approved/rejected",
        "score":""
    }
    ```
11. "/task/:id/all?status=&created_on=&submitted_on=" (method = "GET")
    Get all tasks for manager/worker with specified date and status.
    status = {"unassigned","pending","submitted","approved","rejected"}

#### - Manager
1. "/manager/dashboard" (method = "GET")
    Render dashboard view for manager.

#### - Worker
1. "/worker/dashboard" (method = "GET")
    Render dashboard view for worker.
2. "/worker/profile/" (method = "GET")
    Render profile view.
3. "/worker/profile" (method = "PUT")
    ```
    {
        "name":"",
        "email":"",
        "phone":""
    }
    ```
### File 
1. "/file/:file_name/view" (method = "GET")
    Download the filename with specified file_name.

## How to Run Locally
- Clone Repository
- Install the modules using ```npm install ```.
- Create a .env file inside the  folder, the .env file should contain the following
    ```
    MONOGO_URL = <URL>
    ```
- Run ```nodemon app.js ```


    
    
