[![#thelounge IRC channel on freenode](https://img.shields.io/badge/irc%20channel-%23thelounge%20on%20freenode-blue.svg)](https://avatar.playat.ch:1000/)
[![npm version](https://img.shields.io/npm/v/thelounge.svg)](https://www.npmjs.org/package/thelounge)
[![Travis CI Build Status](https://travis-ci.org/thelounge/lounge.svg?branch=master)](https://travis-ci.org/thelounge/lounge)
[![AppVeyor Build status](https://ci.appveyor.com/api/projects/status/deymtp0lldq78s8t/branch/master?svg=true)](https://ci.appveyor.com/project/astorije/lounge/branch/master)
[![Dependency Status](https://david-dm.org/thelounge/lounge.svg)](https://david-dm.org/thelounge/lounge)
[![devDependency Status](https://david-dm.org/thelounge/lounge/dev-status.svg)](https://david-dm.org/thelounge/lounge#info=devDependencies)

# The Lounge

__What is it?__

The Lounge is a web IRC client that you host on your own server.

*This is the official, community-managed fork of @erming's great initiative, the [Shout](https://github.com/erming/shout) project.*

__What features does it have?__

- Multiple user support
- Stays connected even when you close the browser
- Connect from multiple devices at once
- Responsive layout — works well on your smartphone
- _.. and more!_

__Why the fork?__

We felt that the original [Shout](https://github.com/erming/shout) project
"stagnated" a little because its original author wanted it to remain his pet
project (which is a perfectly fine thing!).

A bunch of people, excited about doing things a bit differently than the upstream
project forked it under a new name: “The Lounge”.

This fork aims to be community managed, meaning that the decisions are taken
in a collegial fashion, and that a bunch of maintainers should be able to make
the review process quicker and more streamlined.

## Install

To use The Lounge you must have [Node.js](https://nodejs.org/en/download/) installed.
The oldest Node.js version we support is 4.2.0.

If you still use 0.10 or 0.12 we strongly advise you to upgrade before installing The Lounge.
For more information on how to upgrade, read the [documentation](https://nodejs.org/en/download/package-manager/).

```
sudo npm install -g thelounge
```

## Usage

When the install is complete, go ahead and run this in your terminal:

```
lounge --help
```

For more information, read the [documentation](https://thelounge.github.io/docs/) or [wiki](https://github.com/thelounge/lounge/wiki).

## Development setup



1. Fork lounge to your github account from the top right corner.
 
2. Clone from your github account.

    ```
    git clone https://github.com/<username>/lounge/
    ```

3. Install dependencies, it takes a while

    ```
    cd lounge/
    npm install
    ``` 

4. Run lounge to generate configuration files

    ```
    npm start
    ```

5. Create new branch and switch into it, name should contain lounge issue ticket 
    number, create one in https://github.com/thelounge/lounge/issues if missing

    ```
    git checkout -b XXX-feature-name
    ``` 

6. Edit code to add your feature.

7. Build and test when its needed. You will have to run `npm run build` if you change or add anything in `client/js/libs` or `client/views`.
 
    ```
    npm run build
    npm run test
    ```

8. If test is passed, add changes and make commit

    ```
    git add -i 
    git commit -m "#xxx - feature info"
    ```

9. Push your changes to github

    ```
    git push origin XXX-feature-name
    ``` 

10. Got to your fork in github Make a Pull Request on Lounge

    ```
    https://github.com/<username>/lounge/
    ``` 

11. Make pull request

12. Profit

If you made typos in commits and want to squash them together, first look git log.
`git log --pretty=oneline -3` where `3` is number of last commits.  `git rebase -i HEAD~3` will open editor.
Put s front of commits what you want to put together.

```
pick fb524f5 This is commit 1
s 2bd1943 This is commit 2
s d911ebf This is commit 3
```  
    
Merge commit messages, usually comment out whats not needed. 

Finally upload to github repository with force flag  `git push origin XXX-feature-name --force` 



## License

Available under the [MIT License](LICENSE).

Some fonts licensed under [SIL OFL](http://scripts.sil.org/OFL) and the [Apache License](http://www.apache.org/licenses/).
