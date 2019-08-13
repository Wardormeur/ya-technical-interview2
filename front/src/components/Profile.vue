<template>
  <div class="profile">
    <form @submit.prevent="save">
      <h2 class="profile__title">Create your profile</h2>
      <div class="profile__names">
        <input type="text" name="first_name" v-validate="'required'" placeholder="First name" v-model="firstName" class="profile__names-first"/>
        <span class="profile__first-name-error">{{ errors.first('first_name') }}</span>
        <input type="text" name="last_name" v-validate="'required'" placeholder="Last name" v-model="lastName" class="profile__names-last"/>
        <span class="profile__last-name-error">{{ errors.first('last_name') }}</span>
      </div>
      <input type="text" name="position" v-validate="'required|max:64'" placeholder="Current position" v-model="position" class="profile__position"/>
        <span class="profile__position-error">{{ errors.first('position') }}</span>
      <textarea type="text" name="about" v-validate="'required|max:255'" placeholder="About you" v-model="about" class="profile__about"/>
      <span class="profile__about-error">{{ errors.first('about') }}</span>
      <div class="profile__topics">
        <label for="topics" class="profile__topics-label">Select your favorite topics</label>
        <span class="profile__topics-error">{{ errors.first('topics') }}</span>
        <label v-for="(topic, index) in topics" :key="index" class="profile__topic">
          <input type="checkbox" name="topics" :value="topic" @click="selectTopic" />
          {{ topic }}
        </label>
      </div>
      <button type="submit" class="profile__submit">Save</button>
    </form>
  </div>
</template>

<script>
import User from '@/api/User';

export default {
  name: 'Profile',
  data: () => {
    const nbTopics = 6; 
    const topics = [...Array(nbTopics).keys()].map(iter => `Topic ${iter}`); 
    return {
      currentUserId: '',
      topics,
      firstName: '',
      lastName: '',
      position: '',
      about: '',
      selectedTopics: [],
    };
  },
  methods: {
    save: async function () {
      this.errors.clear();
      if (this.selectedTopics.length <= 0) {
        this.errors.add({ field: 'topics', msg: 'You must select at least a topic' });
      }
      await this.$validator.validateAll();
      if (this.errors.count() === 0) { 
        const payload = {
          firstName: this.firstName,
          lastName: this.lastName,
          position: this.position,
          about: this.about,
          topics: this.selectedTopics,
        };
        await User.update(this.currentUserId, payload);
        sessionStorage.setItem('currentUser', JSON.stringify({ id: this.currentUserId, ...payload }));
        this.$router.push({ name: 'viewProfile', params: { userId: this.currentUserId }});
      }
    },
    selectTopic: function (e) {
      const { target } = e;
      if (target.checked) {
        this.selectedTopics = [...this.selectedTopics, target.value];
      } else {
        const index = this.selectedTopics.findIndex(val => val === target.value);
        this.selectedTopics.splice(index, 1);
      }
    },
  },
  created: async function () {
    // Coming from a natural naviation link
    this.currentUserId = this.$route.params.userId;
    // Coming from url being entered, we reload our previously saved user
    if (!this.currentUserId) {
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      this.currentUserId = currentUser.id;
    }
    // Load the saved profile for modification
    const { topics: selectedTopics, ...user } = (await User.read(this.currentUserId)).body;
    Object.assign(this, user);
    this.selectedTopics = selectedTopics;
    // because that's not reactive, we have to set the selectedTopics manually
    this.selectedTopics.forEach(topic => document.querySelector(`input[type=checkbox][value="${topic}"]`).checked = true)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../scss/box';
@import '../scss/input';
@import '../scss/topic';
.profile {
  @include box;
}
.profile__title {
  @include box-title;
}
.profile__names {
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
  justify-content: space-between;
  & input {
    flex-basis: 49%;
  }
}
.profile__names-first, .profile__names-last, .profile__position, .profile__about {
  @include input;
  margin-bottom: 0.5rem;
}
.profile__about {
  /*Seems like user-agent reset it for text_areas*/
 font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
}
.profile__topics {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  border: none;
  margin: 0;
  padding: 0;
  &-label {
    display: block;
    flex-basis: 100%;
  }
}
.profile__topic {
  @include topic;
  & input[type=checkbox] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 1rem;
    height: 1rem;
    background-color: whitesmoke;
    border: 1px solid grey; 
    border-radius: 1px;
    vertical-align: bottom;
    &:checked {
      background-color: black;
    }
  }
}
.profile__submit {
  @include box-submit;
}
.profile__first-name-error,
  .profile__last-name-error,
  .profile__position-error,
  .profile__about-error,
  .profile__topics-error {
  @include input-error;
}
</style>

