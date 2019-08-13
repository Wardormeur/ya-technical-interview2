# front

## TODO
E2E tests, cypress is my goto choice since I never got around selenium's flakyness
API error handling (can be done with vee-validate, just didn't take the time to do so)
Logout
Harmonize the CSS (margins in particular, see later on CSS frameworks) 
JWT timeout
Externalize (API) mocks for tests


## Choices
VueJs vs React: I find Vuejs to be more straightforward. React tends to create a multi-level architecture, with a better separation of concerns, but which tends to not prove useful (in my experience) in the long term. Your next rewrite is going to be in another framework.
Topics could have been a separate component (basically, anything looped over should), but since it's not being reused, I'm not going to.
The X cross on top-right of each box haven't been done. The reason for that is that I don't have a single idea what it's supposed to represent in this app: is is closing the page or is it that those boxes supposed to be used as popup?
No cross page storage apart sessionStorage, even though the login/profile is a flow. Time-based decision, Vuex is a possible solution
The flow from one page to another is weird for returning user. What should they be able to do post-login? Re-edit their page?
Gravatar are not used, for multiple reasons: it has its crypto limitations and it means exposing the email (or its hash) through the API. Pretty sure we can find a better solution for avatars :)
Not using a css framework. It's a choice to strenghten my understanding of CSS, but when it comes to design, i'd prefer something properly defined. In this scenario, the margin, the font-size and their responsiveness are missing. Anything is fine (Bulma comes to mind) as long as it stays CSS only (Bootstrap showed its limitations on that side, being too fragile while being a cornerstone of the app)
Limitations of fields are changed since I'm respecting the front-end definition of the model rather than the one specified (and having first/last name separated is necessary if the user is allowed to return to his profile edit page)

## Things I learned
Another good reason why semantic HTML is hard, struggled getting the "Topics" container to flex (last one I learned was how the details tag was finicky) https://bugs.chromium.org/p/chromium/issues/detail?id=375693


## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
