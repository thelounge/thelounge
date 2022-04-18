## Contributing

Welcome to The Lounge, it's great to have you here! We thank you in advance for
your contributions.

### I want to report a bug

- Look at the [open and closed
  issues](https://github.com/thelounge/thelounge/issues?q=is%3Aissue) to see if
  this was not already discussed before. If you can't see any, feel free to
  [open a new issue](https://github.com/thelounge/thelounge/issues/new).
- If you think you discovered a security vulnerability, **do not open a public
  issue on GitHub.** Refer to our [security guidelines](/SECURITY.md) instead.

### I want to contribute to the code

- Make sure to discuss your ideas with the community in an
  [issue](https://github.com/thelounge/thelounge/issues) or on the IRC channel.
- Take a look at the open issues labeled as [`help wanted`](https://github.com/thelounge/thelounge/labels/help%20wanted)
  if you want to help without having a specific idea in mind.
- Make sure that your PRs do not contain unnecessary commits or merge commits.
  [Squash commits](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)
  whenever possible.
- [Rebase](https://git-scm.com/book/en/v2/Git-Branching-Rebasing) (instead of
  merge) outdated PRs on the `master` branch.
- Give extra care to your commit messages. Use the [imperative present
  tense](https://git-scm.com/book/ch5-2.html#Commit-Guidelines) and [follow Tim
  Pope's guidelines](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).
- Each PR will be reviewed by at least two different project maintainers. You
  can read more about this in the [maintainers'
  corner](https://github.com/thelounge/thelounge/wiki/Maintainers'-corner).
- Please document any relevant changes in the documentation that can be found
  [in its own repository](https://github.com/thelounge/thelounge.chat).
- Note that we use prettier on the project. You can set up IDE plugins to format
  on save ([see VS Code one here](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)).
- We have a git hook to automatically run prettier before commit, in case you don't install the plugin.
- If for any reason, prettier does not work for you, you can run `yarn format:prettier` and that should format everything.
- When using VS Code, configuration files have been provided to take advantage of their [container development infrastructure](https://code.visualstudio.com/docs/remote/containers). touted benefits:

    > The Remote - Containers extension lets you use a Docker container as a full-featured development environment. Whether you deploy to containers or not, containers make a great development environment because you can:
    >
    > - Develop with a consistent, easily reproducible toolchain on the same operating system you deploy to.
    > - Quickly swap between different, separate development environments and safely make updates without worrying about impacting your local machine.
    > - Make it easy for new team members / contributors to get up and running in a consistent development environment.
    > - Try out new technologies or clone a copy of a code base without impacting your local setup.
  
  To get started add the [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension and follow installation instructions provided there.
