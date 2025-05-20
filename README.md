# NexonGameEventSystemMono

## 소개

- 3개의 마이크로서비스를 위해 Nx 모노리포 구성을 채택했습니다.
- Apps 에는 Gateway, Auth, Event 서비스가 구성되어있고, Libs 에 각 서비스들이 사용할 Model, DTO, Interface 등으로 구성했습니다.

## 실행 방법

기본적으로 Nx 혹은 Docker Command 를 사용하실 수 있으나, 숏컷을 작성해두었습니다.

$pnpm install

- 패키지를 인스톨 합니다.

$pnpm compose:up (<-> pnpm compose:downv)

- 컨테이너를 실행합니다.

* mongodb 컨테이너 로컬 접속이 불가 시 "$vi /etc/hosts" 를 통해 127.0.0.1 mongo 라인을 추가 부탁드립니다.

각 apps 에 .envsample 파일을 .env 로 변경해주시고, apps/gateway 와 apps/auth 의 .env JWT_SECRET 키값은 동일하게 일치시켜 주시기 바랍니다.

$pnpm start:all

- Gateway, Auth, Event 서비스를 동시에 실행합니다.

## 메세지

- 초기 부트스트랩 단계에서 최고 권한(root@nexon.com/maplestory)계정 및 Item 6종, Event 1종, Reward 1종을 더미 생성합니다.

- Admin 과 Player 도메인이 분리되어 있으며, 각각 Login 시 발급받은 토큰을 Header:Authorization 의 Bearer Token 방식으로 주입하여 API 요청을 시작하실 수 있습니다.

- Swagger (/api/docs) API 문서를 작성해두었습니다.

부족한 점과 아쉬운 점이 많이 남습니다. 하지만, 최대한 열심히 임하고자 하였습니다.
감사합니다.

지원자 드림

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/node?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Finish your CI setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/Fka7zEVMvx)

## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve gateway
```

To create a production bundle:

```sh
npx nx build gateway
```

To see all available targets to run for a project, run:

```sh
npx nx show project gateway
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/node:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/node:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/node?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:

- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
