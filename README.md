# OrganHarvester-s-Hytale-auto-username-bulk-checker
Checks available usernames on Hytale creates files for available users , unavailable users and a file to add your users to check. Has built in anti-duplicates so you dont check the same one multiple times and has a check rate that will not get you rate limited. Check hundreds of users automatically 

Step 1: Install Node.js
https://nodejs.org/en
then open CMD, run node -v
If it prints a version (like v20.x.x), you’re good.


Step 2:  Move the files into the correct place 
Once the Checker has been downloaded move it into this pathing 
C:\Users\YourFileHere

Step 3: Create the usernames file (One will be included this is just extra incase it fails)
Open Notepad
Put your users in here in this format, one per row.

User1
User2 
User3

Save this Notepad and name it Users.txt
Make sure its saved in the same location as the checker file i.e C:\Users\YourFileHere

Step 4: Open a terminal in that folder
Open the folder in File Explorer
Click the address bar, type CMD, press Enter
then run 
npm init -y

this will create a package.json file. 

Step 5: Install the required package (optional)
this script uses Notifications for automation so this is not needed but just optional
Open CMD and run 
npm install node-notifier

Step 6: Run the script
Run this in CMD
node Checker.js

You will see stuff like this 

Name > Available > 200
Name > Unavailable > 400
Name > Duplicate

Step 7: Check your output files

After running, your folder will contain:

available.txt
unavailable.txt

Common problems (quick fixes)

“node is not recognized” (Windows)
Node.js isn’t installed or terminal wasn’t restarted.

“Cannot find module 'node-notifier'”
 You didn’t run npm install node-notifier in the same folder.

Script stops with “Rate Limited”
The API blocked you temporarily. Wait a bit and rerun later, or increase the delay.
