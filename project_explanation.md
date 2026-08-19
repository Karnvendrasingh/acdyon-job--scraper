# Project Explanation: Scrapling Job Radar

### 1. What was the assignment?
The assignment was to build a **portfolio/demo project** that proves you know how to build a highly reliable "Data Ingestion Pipeline" (a system that automatically fetches data from the internet). 

Specifically, the assignment asked for a system that scrapes **job listings** from public APIs. It came with some very strict rules to show that it was built professionally:
* **No breaking rules:** It is strictly forbidden from trying to log into sites like LinkedIn or Indeed. It must only fetch data from public, free sources (like *RemoteOK* and *Arbeitnow*).
* **Be polite:** It must not spam the websites. It has to limit how fast it requests data (Rate Limiting).
* **Be unbreakable (Resilience):** If a website goes down or changes its structure, the program shouldn't crash. It should automatically switch to a backup website or try to fix itself.
* **Store the data:** It needs to save the jobs into a database and show them on a simple web dashboard.

---

### 2. How the project actually works
Imagine you hired an automated assistant to look for jobs for you. That is exactly what this project is. 

Here is what the project is doing:

1. **Waking up on a schedule:** Inside the code, there is an alarm clock (`APScheduler`) that goes off every 30 minutes.
2. **Checking the primary target:** When it wakes up, it tries to visit the primary job website: `remoteok.com`. 
3. **The Backup Plan (Failover):** If `remoteok.com` is broken, blocked, or returning errors, the assistant says "Okay, I'll use the backup instead" and immediately switches to checking `arbeitnow.com`. 
4. **Reading the data:** It downloads the list of jobs from the website in a raw, messy format (JSON).
5. **Cleaning and Saving:** It cleans up the data so that all jobs have a neat Title, Company, and Link. Then, it saves them into a local SQLite database (`jobs.db`). It's smart enough to check if it already saved a job yesterday so it doesn't create duplicates.
6. **Showing it to you:** Finally, it runs a web server. When you open your browser to `http://localhost:8000`, the server grabs all those neatly organized jobs from the database and displays them on your screen.

In short: **It is an automated bot that quietly runs in the background, reliably harvests remote job listings from public websites, and stores them in a database for you to view on a dashboard.**
