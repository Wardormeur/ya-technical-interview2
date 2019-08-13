<template>
  <div id="app">
    <router-view :key="$route.path"/>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}
html, body {
  height: 100%;
}
body {
  margin: 0;
  background-color: whitesmoke;
}
#app {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif; 
}
</style>
