<template>
  <div class="vprofile">
    <a :href="avatarUrl"><img alt="avatar" :src="avatarUrl" class="vprofile__avatar"/></a>
    <hgroup>
      <h2 class="vprofile__name">{{ firstName }} {{ lastName }}</h2>
      <h3 class="vprofile__position">{{ position }}</h3>
    </hgroup>
    <div class="vprofile__delimiter"/>
    <p class="vprofile__about">{{ about }} </p>
    <div class="vprofile__topics">
      <span v-for="(topic, index) in sortedTopics" :key="index" class="vprofile__topic">
        {{ topic }}
      </span>
    </div>
    <router-link :to="{ name: 'editProfile' }" v-if="isOwn" class="vprofile__edit-link">&lsaquo; Edit your own profile</router-link>
  </div>
</template>

<script>
import User from '@/api/User';
export default {
  name: 'Profile',
  data: () => {
    return {
      currentUser: {},
      topics: [],
      firstName: '',
      lastName: '',
      position: '',
      about: '',
    };
  },
  computed: {
    isOwn: function () {
      return this.currentUser.id === Number.parseInt(this.$route.params.userId);
    },
    avatarUrl: function () {
      return `https://robohash.org/${this.firstName}${this.lastName}`;
    },
    sortedTopics: function () {
      return this.topics.slice().sort((topic1, topic2) => {
          return this.currentUser.topics.indexOf(topic2) - this.currentUser.topics.indexOf(topic1);  
      });
    },
  },
  created: async function () {
    const { userId } = this.$route.params;  
    const user = (await User.read(userId)).body;
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    Object.assign(this, user);
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../scss/colors.scss';
@import '../scss/box';
@import '../scss/input';
@import '../scss/topic';
.vprofile {
  @include box;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.vprofile__name {
  @include box-title;
  padding-bottom: 0;
  text-align: center;
}
.vprofile__position {
  margin-top: 0;
  font-weight: 300;
  text-align: center;
}
.vprofile__delimiter {
  background-color: $theme-color;
  width: 10rem;
  text-align: center;
  height: 2px;
}
.vprofile__avatar {
  max-width: 150px;
}
.vprofile__about {
  text-align: center;
}
.vprofile__topics {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  border: none;
  margin: 0;
  padding: 0;
}
.vprofile__topic {
  @include topic;
}
.vprofile__edit-link {
  @include box-link;
}
</style>
