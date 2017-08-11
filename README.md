# hospitality-dispatch-service

## Project Links
[Box folder](https://cognizant-eba.app.box.com/files)

[Pivotal Tracker](https://www.pivotaltracker.com/n/projects/2014537 )
 
## Setting Up Server

1. Download [NodeJS](https://nodejs.org/en/download/) and install
2. Clone Git [repo](https://github.com/CognizantStudio/hospitality-dispatch-service.git) using terminal
```sh
$ git clone https://github.com/CognizantStudio/hospitality-dispatch-service.git
```
3. Install Node dependancies
```sh
$ npm install

```
4. Set up Eniviornment Variables
```sh
$ cp .env.example .env.
```
5. Start server
```sh
$ npm start
```
6. Navigate to `http://localhost:<PORT>`  
## Testing

Testing for the project uses Mocha as a test runner. It also uses PrettierJS as a formatter of JavaScript Files, and will reformat all js files on git pre commit. To run the tests use the following command:
```sh
 $ npm test
```
## Database 

Database for this project [MongoDB](https://www.mongodb.com/) and it is configured in [mLab](https://mlab.com/databases/falcon).

To connect using a driver via the standard MongoDB URI :mongodb://<dbuser>:<dbpassword>@ds161001.mlab.com:61001/falcon<br/>
To connect using the mongo shell:
```sh
$ mongo ds161001.mlab.com:61001/falcon -u <dbuser> -p <dbpassword>
```
## Dispatch Service API Reference

To generate API documentaion, run below command
```sh
$ npm run builddocs
```
To view API documentation, start the server and navigate to `http://localhost:<PORT>/`.
## Project Standards
This section will describe all the standards and practices of this project

### Git workflow

This project uses [this](http://danielcoding.net/gitflow-branching-model/) branching model

There will be a master branch which will contain the deployable code.  There will be a development branch that keeps the current working features, and any work will be done on a feature, or bugfix branch.  Then the feature or bugfix branch will be code reviewed and merged into develop branch.

When enough features to create the next version of software have been merged, a release branch will be created from develop branch and testing will be done on that branch.  There will be no more features added once that branch is created. Only bugfix branch will be made off of the release branch.  When testing is complete that branch will be merged into master and master will be tagged with the version number.

[Here is a more in-depth article on branch explanation](http://danielcoding.net/gitflow-branching-model/)

![Git Flow Image](http://danielcoding.net/wp-content/uploads/2015/07/gitflow.png)

#### Naming Branches

This project follows [Git Flow](http://nvie.com/posts/a-successful-git-branching-model/) naming convention.

If you are working on a feature branch, begin by checking out a new
branch from develop named `f/1-short-description-of-branch`, where `f`
represents that it's a feature and `1` is the Pivotal Tracker ID number. If
you are not working on a feature, but a chore, release, or bug,
use an `c`, `r`, or `b` prefix instead.

#### Pull Requests (PR)

Use this [Pull Request template](https://gist.github.com/fluxusfrequency/aea146a75e0d6d3e63d3) in your PR on GitHub. Assign the PR
ticket to someone who you want to have look it over, _and_ let them know
via Slack.

#### Submitting your PR

1. NEVER WORK IN MASTER, but do branch off of develop for each feature.
1. Pull develop, check out a new branch and name as described above.
1. Work in your branch and commit. Multiple commits are fine, they will be squashed at merge into master. Push periodically, and force push your branch if you keep up to date with master by also periodically rebasing your branch on top of develop. To force push your branch, add the flag `--force` to your command.
1. Once you are finished with your work, and still checked out in your branch, rebase your branch on top of the current develop at origin.

  ```sh
  $ git rebase origin/develop

```

  Resolve any merge conflicts as necessary. Remember to review changes from the conflict coming in from develop as they might have important changes to include in your branch.

1. Push your branch to origin, go to the repo on GitHub and submit pull request. Fill out the Pull Request Template.
1. Add the PR label "Ready For Review", and assign all group members to the PR.
1. The git slackbot will let everyone in the channel know when a PR is ready

#### Approval of PRs (two or more people will review)

1. Review code and comment.
1. Pull branch down,.
1. If all is well:
  * and there is no PR label "Approved +1":
    * add the PR label "Approved +1"
    * let group members know in slack that it is ready for another look
  * and the PR is already tagged with "Approved +1"
    * let group members know that you are ready to pull changes into master
    * wait a few minutes, and proceed to pull changes into master
1. If there are merge conflicts, tell the committer(s) to pull master again and review from beginning when they are finished.
1. Merge pull request via GitHub online interface, and select "squash and merge".
1. Delete the branch from GitHub via online interface.
1. Delete the branch locally.

### Coding Style Guide

We're using AirBnB's [style guide](https://github.com/airbnb/javascript). 

#### Unused Code
All unused code should be removed.  There should be no commented code.

#### Spacing
1. There should be using 2 spaces per indent and spaces instead of tabs.
1. There should be a new line at between each function, and each set of variable definitions and any code blocks.
1. There should be 2 new lines after imports.

#### Smiley Face
It is very important to have the correct smile signifying the immense amount of happiness and excitement for the coding project. The closing square bracket ] is used because it represents the largest smile able to be captured using ASCII art. A closing parenthesis ) creates a half-hearted smile, and thus is not preferred.

##### Preferred:
```
:]
```
##### Not Preferred:
```
:)
```



Happy Coding! ;]
