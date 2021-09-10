# Setup a new opsmap / Project Administration

For the sake of this walkthrought, We will call the new opsmap `opsmap-XXX`.

The main steps are:

- fork opsmap-toolkit project
- add this project data
- configure the gitlab page
- plug the repo to opsmap-toolkit

> It's important you set all this up before starting to work. Otherwise, you might encounter some weird bugs, behaviors, ebcause of the late configuration. It only requires a few minutes, don't be lazy ;)

## Fork opsmap-toolkit

The idea here is very simple, but a few steps are required to move and rename the project.
First, visit the gitlab opsmap-toolkit [page](https://gitlab.cartong.org/HCR/opsmap/opsmap-toolkit).
On the top-right corner, there is the fork button. Just click it.

You won't have a choice, you'll be force to select your personal namespace. We'll fix this in a minute.

Hit your namespace, and a few seconds later, bim, the project is forked.

### Change the name

The project is called.. opsmap-toolkit. we want to update this to opsmap-xxx.

> Settings > General > Naming, topics, avatar

Simply type the new name, `opsmap-xxx`. Since you're here, let's update the project avatar. with a nice flag.

Tadam, the project name is changed.

### Change the path

To be consistent with the name, please update the path to match the exact same name.

> Settings > General > Advanced > Change path

Replac `opsmap-toolkit` with `opsmap-xxx`. And validate.

### Move the project the correct namespace

Move the project to the HCR/opsmap group. This is the correct spot.

> Settings > General > Advanced > Transfer project

Select HCR/opsmap, and validate. Follow the instructions.

It's done.

## Add your data

The raw data must be added inside the `public/data` folder, next to `demo`. In a folder called `xxx`

> public/data/xxx

Then, modify the path inside the entry point.

> src/entry-point-app.ts

Update the general_config.json path.

```typescript
TKReadGeneralConfiguration( `${process.env.BASE_URL}/data/xxx/general_config.json
```

You're all set !

## Configure Gitlab page

Since it's a fork of the opsmap-tookit repo, it contains the demo dataset project imported from opsmap-toolkit.

We need to update the gitlab ci script, to exclude those data. Use the following template.

> `.gitlab-ci.yml`

```yml
pages:
  image: node:latest
  stage: deploy
  script:
    - npm install --progress=false
    - npm run build
    - rm -rf public
    - mkdir public
    - mkdir public/data
    - cp -r dist/data/xxx public/data
    - cp -r dist/img public
    - cp -r dist/js public
    - cp dist/index.html public/index.html
    - cp dist/favicon.ico public/favicon.ico
    - cp public/index.html public/404.html
  artifacts:
    expire_in: 1 day
    paths:
      - public
  tags:
    - opsmap
  only:
    - pages
```

Here, we only iclude our data. That's the same thing as excluding demo data.

Now, you're plugged to opsmap dedicated runner and the opsmap pages is set up. Easy.

## Plug the repo to opsmap-toolkit

The opsmap-toolkit has a release branch, called toolkit-release. This is automatically pushed and updated to the different opsmap repositories.
This has to be configured on both side, `ospmap-toolkit` and `opsmap-XXX`.
Therefore, a small step of configuration is necessary:

### On the opsmap toolkit side

Add the opsmap-XXX repository as a mirror repository.

> Settings / Repository / Mirrorring repository

For the parameters, you have to set the following values:

> Git reposity url: `ssh://gitlab.cartong.org/HCR/opsmap/opsmap-XXX.git`
> Mirror direction: `push`
> Click on `Detect keys`
> Authentification Method: `SSH public key`
> Check: **Check** only mirror protected branches. you don't want to propagate your entire repo.

Validate the formular by clicking the `Mirror Repository` button.

Then, the repo you just added should appear in the `Mirror Repositories` list below.

> It's normal if the mirroring encounter a ssh public key error. It's the next step.

On the right of the item you just added, you will find the `Copy SSH public key`. Click it, or remember where it is. You'll need on the opsmap-XXX side.

### On the opsmap XXX side

Now that the `opsmap-XXX` has been set as mirror repo on the `opsmap-toolkit`, you have to et up the authorization for the toolkit on the XXX side.

> Settings / Repository / Deploy Key

You have to create a new deploy key for this project. Fill the form:

> Title: your pick. `opsmap-toolkit` might be a clear title.
> Key: paste the one you copied at the end of the previous step.
> Check: **Check** write access allowed

Validate the formular by clicking the `Add key` button.

You have now granted opsmap-toolkit access to your repos.

> You can test this by triggering a push manually, in the opsmap-toolkit menu (cf previous step).
